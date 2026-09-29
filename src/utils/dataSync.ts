import { PolicePositionRecord } from '../types/police';
import { APP_DATA_VERSION, INITIAL_POLICE_RECORDS } from '../data/initialData';

export const STORAGE_KEY = 'police_position_master_records_v2';
export const LOCAL_VERSION_KEY = 'police_position_data_version';
export const LAST_UPDATED_KEY = 'police_position_last_updated';

/**
 * Load records with smart version checking:
 * If the user's localStorage contains an older version or doesn't have the 545 records dataset,
 * automatically migrate and load the fresh INITIAL_POLICE_RECORDS dataset!
 */
export function getStoredRecords(): PolicePositionRecord[] {
  if (typeof window === 'undefined') return INITIAL_POLICE_RECORDS;
  try {
    const storedVersion = localStorage.getItem(LOCAL_VERSION_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);

    // If version matches and data is valid
    if (storedVersion === APP_DATA_VERSION && raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Older version or no data found: update cache to latest official records (545 items)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POLICE_RECORDS));
    localStorage.setItem(LOCAL_VERSION_KEY, APP_DATA_VERSION);
    localStorage.setItem(LAST_UPDATED_KEY, new Date().toISOString());
    return INITIAL_POLICE_RECORDS;
  } catch (err) {
    console.error('[DataSync] Error loading records from localStorage:', err);
    return INITIAL_POLICE_RECORDS;
  }
}

/**
 * Save records to local storage
 */
export function saveStoredRecords(records: PolicePositionRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    localStorage.setItem(LOCAL_VERSION_KEY, APP_DATA_VERSION);
    localStorage.setItem(LAST_UPDATED_KEY, new Date().toISOString());
  } catch (err) {
    console.error('[DataSync] Error saving records to localStorage:', err);
  }
}

/**
 * Format ISO date string into readable Thai datetime
 */
export function formatThaiDateTime(isoString?: string | null): string {
  if (!isoString) return 'ปรับปรุงล่าสุด: ๒๙ กันยายน ๒๕๖๙';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const day = d.getDate();
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    const month = thaiMonths[d.getMonth()];
    const thaiYear = d.getFullYear() + 543;
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${day} ${month} ${thaiYear} เวลา ${hours}:${minutes}:${seconds} น.`;
  } catch {
    return isoString;
  }
}

/**
 * Download records as a JSON backup file
 */
export function exportDatabaseBackupJson(records: PolicePositionRecord[]): void {
  const payload = {
    exportedAt: new Date().toISOString(),
    system: 'ระบบบริหารจัดการข้อมูลการกันตำแหน่งข้าราชการตำรวจ (งานประทวน 1)',
    version: APP_DATA_VERSION,
    totalRecords: records.length,
    records,
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const d = new Date();
  const dateStr = `${d.getFullYear()+543}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`;
  link.href = url;
  link.download = `สำรองข้อมูลทำเนียบกำลังพล_อต_ตร_${records.length}_ตำแหน่ง_${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse uploaded JSON backup file
 */
export function parseDatabaseBackupJson(file: File): Promise<PolicePositionRecord[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        let recordsArray: any[] = [];
        if (Array.isArray(parsed)) {
          recordsArray = parsed;
        } else if (parsed && Array.isArray(parsed.records)) {
          recordsArray = parsed.records;
        } else {
          return reject(new Error('รูปแบบไฟล์ JSON ไม่ถูกต้อง ไม่พบรายการข้อมูลตำแหน่ง'));
        }

        if (recordsArray.length === 0) {
          return reject(new Error('ไฟล์ JSON ไม่มีข้อมูลรายการ'));
        }

        resolve(recordsArray as PolicePositionRecord[]);
      } catch (err: any) {
        reject(new Error(`อ่านไฟล์ JSON ไม่สำเร็จ: ${err.message}`));
      }
    };
    reader.onerror = () => reject(new Error('เกิดข้อผิดพลาดในการอ่านไฟล์'));
    reader.readAsText(file);
  });
}

/**
 * Force clear local storage cache and reload official initial records
 */
export function clearBrowserCache(): PolicePositionRecord[] {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('police_position_master_records_v1');
      localStorage.removeItem(LOCAL_VERSION_KEY);
      localStorage.removeItem(LAST_UPDATED_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POLICE_RECORDS));
      localStorage.setItem(LOCAL_VERSION_KEY, APP_DATA_VERSION);
      localStorage.setItem(LAST_UPDATED_KEY, new Date().toISOString());
    } catch (e) {
      console.error('Failed to clear local cache', e);
    }
  }
  return INITIAL_POLICE_RECORDS;
}
