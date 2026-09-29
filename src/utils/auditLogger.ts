import { AuditLogItem, PoliceCategory, PolicePositionRecord } from '../types/police';
import { getThaiDateTimeNow } from './formatters';

const AUDIT_STORAGE_KEY = 'police_position_audit_logs_v1';
const OFFICER_NAME_KEY = 'police_position_current_officer';

export const DEFAULT_OFFICER_NAME = 'ร.ต.อ. ธนกฤต บริหารงานสารบรรณ (กำลังพล ตร.)';

export function getCurrentOfficerName(): string {
  if (typeof window === 'undefined') return DEFAULT_OFFICER_NAME;
  return localStorage.getItem(OFFICER_NAME_KEY) || DEFAULT_OFFICER_NAME;
}

export function setCurrentOfficerName(name: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(OFFICER_NAME_KEY, name);
}

export function getAuditLogs(): AuditLogItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load audit logs', e);
    return [];
  }
}

export function saveAuditLog(log: Omit<AuditLogItem, 'id' | 'timestamp'>): AuditLogItem {
  const newLog: AuditLogItem = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: getThaiDateTimeNow(),
  };

  if (typeof window !== 'undefined') {
    try {
      const current = getAuditLogs();
      const updated = [newLog, ...current.slice(0, 499)]; // retain last 500 logs
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save audit log', e);
    }
  }

  return newLog;
}

export function recordRecordCreation(record: PolicePositionRecord, officer = getCurrentOfficerName()) {
  return saveAuditLog({
    officerName: officer,
    action: 'CREATE',
    category: record.category,
    recordId: record.id,
    positionNumber: record.positionNumber,
    targetPerson: record.personRankName || '(ตำแหน่งว่าง)',
    fieldChanged: 'สร้างรายการใหม่',
    newValue: `ตำแหน่ง: ${record.positionNumber} (${record.positionRank}) สังกัด: ${record.positionName}`,
    details: `เพิ่มรายการกันตำแหน่งหมวด "${record.category}" ตามหนังสือ ${record.reservationNoDate}`
  });
}

export function recordRecordUpdate(
  oldRec: PolicePositionRecord,
  newRec: PolicePositionRecord,
  officer = getCurrentOfficerName()
) {
  // Detect changed fields
  const changedFields: (keyof PolicePositionRecord)[] = [];
  const changesSummary: string[] = [];

  const keysToCheck: (keyof PolicePositionRecord)[] = [
    'reservationNoDate', 'docOriginUnit', 'docBookNumber', 'docDate',
    'category', 'positionNumber', 'positionRank', 'positionName',
    'division', 'bureau', 'duty', 'lineOfWork', 'workGroup',
    'personRankName', 'idCard', 'requestSource', 'appointmentOrder',
    'appointmentEffectiveDate', 'resolutionNo', 'transferredRankOrPosition', 'notes'
  ];

  for (const k of keysToCheck) {
    if (String(oldRec[k] || '') !== String(newRec[k] || '')) {
      changedFields.push(k);
      changesSummary.push(`${k}: "${oldRec[k] || '-'}" ➔ "${newRec[k] || '-'}"`);
    }
  }

  if (changedFields.length === 0) return null;

  return saveAuditLog({
    officerName: officer,
    action: 'UPDATE',
    category: newRec.category,
    recordId: newRec.id,
    positionNumber: newRec.positionNumber,
    targetPerson: newRec.personRankName || oldRec.personRankName || '(ตำแหน่งว่าง)',
    fieldChanged: changedFields.join(', '),
    oldValue: changedFields.map(f => `${f}: ${oldRec[f] || '-'}`).slice(0, 3).join('; '),
    newValue: changedFields.map(f => `${f}: ${newRec[f] || '-'}`).slice(0, 3).join('; '),
    details: `แก้ไขข้อมูล ${changedFields.length} ช่อง: ${changesSummary.join(' | ')}`
  });
}

export function recordRecordDeletion(record: PolicePositionRecord, officer = getCurrentOfficerName()) {
  return saveAuditLog({
    officerName: officer,
    action: 'DELETE',
    category: record.category,
    recordId: record.id,
    positionNumber: record.positionNumber,
    targetPerson: record.personRankName || '(ตำแหน่งว่าง)',
    fieldChanged: 'ลบรายการ',
    oldValue: `ตำแหน่ง: ${record.positionNumber}, ผู้ครอง: ${record.personRankName || '-'}, สังกัด: ${record.positionName}`,
    newValue: '(ลบแล้ว)',
    details: `ลบรายการกันตำแหน่งหมวด "${record.category}" ออกจากระบบสารบรรณ`
  });
}

export function clearAuditLogs(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  }
}
