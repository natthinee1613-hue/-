import { PolicePositionRecord } from '../types/police';

export interface ServerSyncResponse {
  success: boolean;
  version: number;
  lastPublishedAt: string;
  lastPublishedBy?: string;
  totalRecords: number;
  records: PolicePositionRecord[];
}

export interface PublishResult {
  success: boolean;
  version?: number;
  lastPublishedAt?: string;
  message?: string;
  error?: string;
}

export const STORAGE_KEY = 'police_position_master_records_v2';
export const LOCAL_VERSION_KEY = 'police_position_data_version';
export const LAST_PUBLISHED_KEY = 'police_position_last_published';

/**
 * Fetch the latest records published on the server
 */
export async function fetchServerRecords(): Promise<ServerSyncResponse | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('/api/records', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Always get fresh data
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.records)) {
      return data as ServerSyncResponse;
    }
    return null;
  } catch (err) {
    console.warn('[DataSync] Could not fetch server records, falling back to local storage:', err);
    return null;
  }
}

/**
 * Publish updated records to the web server
 */
export async function publishRecordsToWeb(
  records: PolicePositionRecord[],
  officerName: string,
  note?: string
): Promise<PublishResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch('/api/records/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records,
        publishedBy: officerName,
        note: note || `เผยแพร่อัปเดตข้อมูลตารางลงเว็ป (${records.length} รายการ)`,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, error: `HTTP ${res.status}: ${errorText}` };
    }

    const result = await res.json();
    if (result.success) {
      // Save last published timestamp locally
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        localStorage.setItem(LOCAL_VERSION_KEY, String(result.version));
        localStorage.setItem(LAST_PUBLISHED_KEY, result.lastPublishedAt);
      }
      return {
        success: true,
        version: result.version,
        lastPublishedAt: result.lastPublishedAt,
        message: result.message || 'เผยแพร่ข้อมูลลงเว็ปเรียบร้อยแล้ว',
      };
    }

    return { success: false, error: result.error || 'การเผยแพร่ข้อมูลไม่สำเร็จ' };
  } catch (err: any) {
    console.error('[DataSync] Error publishing records to web:', err);
    return {
      success: false,
      error: err.name === 'AbortError' ? 'หมดเวลาเชื่อมต่อกับเซิร์ฟเวอร์' : (err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ'),
    };
  }
}

/**
 * Reset server records to initial default
 */
export async function resetServerRecords(): Promise<PolicePositionRecord[] | null> {
  try {
    const res = await fetch('/api/records/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.records)) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.records));
          localStorage.setItem(LOCAL_VERSION_KEY, '1');
          localStorage.setItem(LAST_PUBLISHED_KEY, data.lastPublishedAt);
        }
        return data.records;
      }
    }
    return null;
  } catch (err) {
    console.error('[DataSync] Failed to reset server records:', err);
    return null;
  }
}

/**
 * Format ISO date string into readable Thai datetime
 */
export function formatThaiDateTime(isoString?: string | null): string {
  if (!isoString) return 'ยังไม่มีข้อมูลการเผยแพร่';
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
    version: '2.0',
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
  link.download = `สำรองข้อมูลทำเนียบกำลังพล_อต_ตร_${dateStr}.json`;
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
 * Force clear local storage cache
 */
export function clearBrowserCache(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('police_position_master_records_v1');
    localStorage.removeItem(LOCAL_VERSION_KEY);
    localStorage.removeItem(LAST_PUBLISHED_KEY);
  } catch (e) {
    console.error('Failed to clear local cache', e);
  }
}
