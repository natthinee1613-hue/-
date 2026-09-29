import * as XLSX from 'xlsx';
import { PoliceCategory, PolicePositionRecord, POLICE_CATEGORIES } from '../types/police';
import { formatPositionNumber } from './formatters';

// Column mappings from varied Thai header names to our PolicePositionRecord keys
const HEADER_MAP: Record<string, keyof PolicePositionRecord> = {
  'ลำดับที่': 'orderNo',
  'ลำดับ': 'orderNo',
  'order': 'orderNo',
  'orderno': 'orderNo',

  'ผ. ....../วันเดือนปี': 'reservationNoDate',
  'ผ. ....../วันเดือนปีที่กันตำแหน่ง': 'reservationNoDate',
  'ที่กันตำแหน่ง': 'reservationNoDate',
  'ผ.': 'reservationNoDate',
  'เลขที่ ผ.': 'reservationNoDate',
  'reservationnodate': 'reservationNoDate',

  'กันตำแหน่งตามหนังสือ': 'docOriginUnit',
  'บก./บช.': 'docOriginUnit',
  'หน่วยงานเจ้าของเรื่อง': 'docOriginUnit',
  'หน่วยงานเจ้าของเรื่อง (บก./บช.)': 'docOriginUnit',
  'docoriginunit': 'docOriginUnit',

  'ที่...': 'docBookNumber',
  'เลขที่หนังสือ': 'docBookNumber',
  'เลขที่หนังสือต้นเรื่อง': 'docBookNumber',
  'docbooknumber': 'docBookNumber',

  'ลงวันที่': 'docDate',
  'หนังสือลงวันที่': 'docDate',
  'ว/ด/ป': 'docDate',
  'docdate': 'docDate',

  'หมวด': 'category',
  'หมวดการกันตำแหน่ง': 'category',
  'กลุ่มกรณี': 'category',
  'category': 'category',

  'เลขตำแหน่ง': 'positionNumber',
  'positionnumber': 'positionNumber',

  'ระดับตำแหน่ง': 'positionRank',
  'ระดับ': 'positionRank',
  'positionrank': 'positionRank',

  'ตำแหน่ง/หน่วยงาน': 'positionName',
  'ตำแหน่ง / สังกัด / หน่วยงาน': 'positionName',
  'ตำแหน่ง': 'positionName',
  'หน่วยงาน': 'positionName',
  'positionname': 'positionName',

  'บก.': 'division',
  'กองบังคับการ': 'division',
  'division': 'division',

  'บช.': 'bureau',
  'กองบัญชาการ': 'bureau',
  'bureau': 'bureau',

  'ทำหน้าที่': 'duty',
  'duty': 'duty',

  'สายงาน': 'lineOfWork',
  'lineofwork': 'lineOfWork',

  'กลุ่มสายงาน': 'workGroup',
  'workgroup': 'workGroup',

  'ยศ  ชื่อ  สกุล': 'personRankName',
  'ยศ ชื่อ สกุล': 'personRankName',
  'ยศ-ชื่อ-สกุล': 'personRankName',
  'ชื่อ-สกุล': 'personRankName',
  'personrankname': 'personRankName',

  'เลขที่บัตร': 'idCard',
  'ประชาชน': 'idCard',
  'เลขที่บัตรประชาชน': 'idCard',
  'เลขประจำตัวประชาชน': 'idCard',
  'idcard': 'idCard',

  'ร้องขอจาก': 'requestSource',
  'ร้องขอจาก...': 'requestSource',
  'requestsource': 'requestSource',

  'คำสั่งบรรจุ': 'appointmentOrder',
  'คำสั่งบรรจุ/ที่': 'appointmentOrder',
  'appointmentorder': 'appointmentOrder',

  'มีผลวันที่': 'appointmentEffectiveDate',
  'คำสั่งบรรจุมีผลวันที่': 'appointmentEffectiveDate',
  'appointmenteffectivedate': 'appointmentEffectiveDate',

  'มติ ก.ตร.': 'resolutionNo',
  'มติ ก.ตร. / อ.ก.ตร.': 'resolutionNo',
  'resolutionno': 'resolutionNo',

  'ระดับที่ตัดโอน': 'transferredRankOrPosition',
  'เลขตำแหน่งรอง สว. ที่รองรับ': 'transferredRankOrPosition',
  'transferredrankorposition': 'transferredRankOrPosition',

  'หมายเหตุ': 'notes',
  'หมายเหตุ / สถานะ': 'notes',
  'สถานะ': 'statusBadge',
  'สถานะสากล': 'statusBadge',
  'statusbadge': 'statusBadge',
  'badge': 'statusBadge',
  'notes': 'notes',
};

export interface SheetParseResult {
  sheetName: string;
  category: PoliceCategory;
  rows: Partial<PolicePositionRecord>[];
  totalFound: number;
}

export interface FileParseResult {
  fileName: string;
  sheets: SheetParseResult[];
  allRecords: PolicePositionRecord[];
}

/**
 * Match a raw sheet name to one of the 13 categories
 */
export function matchCategory(sheetName: string, defaultCategory: PoliceCategory = 'ให้ออกจากราชการไว้ก่อน'): PoliceCategory {
  const cleanName = sheetName.trim();
  for (const cat of POLICE_CATEGORIES) {
    if (cleanName.includes(cat) || cat.includes(cleanName)) {
      return cat;
    }
  }
  if (cleanName.includes('นรต')) return 'กัน รร.นรต.';
  if (cleanName.includes('พัก')) return 'พักราชการ';
  if (cleanName.includes('กลับ')) return 'กลับเข้ารับราชการ';
  if (cleanName.includes('โอนเข้า')) return 'รับโอนเข้า';
  if (cleanName.includes('ตัดโอน')) return 'การตัดโอน';
  if (cleanName.includes('เลือกตั้ง')) return 'เลือกตั้ง';
  if (cleanName.includes('ทายาท')) return 'ทายาท';
  if (cleanName.includes('กีฬา')) return 'นักกีฬา';
  if (cleanName.includes('วุฒิ') || cleanName.includes('นโยบาย')) return 'ผู้มีวุฒิ+นโยบาย';
  if (cleanName.includes('สอบ')) return 'เปิดสอบ';
  if (cleanName.includes('นสต')) return 'นสต.ปี 2569';
  if (cleanName.includes('ยุบเลิก') || cleanName.includes('ก.ตร')) return 'ยุบเลิก มติ ก.ตร.';

  return defaultCategory;
}

/**
 * Read and parse Excel / CSV file
 */
export async function parseExcelOrCsvFile(file: File, fallbackCategory: PoliceCategory = 'ให้ออกจากราชการไว้ก่อน'): Promise<FileParseResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

  const resultSheets: SheetParseResult[] = [];
  const combinedRecords: PolicePositionRecord[] = [];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    // Convert to 2D array of rows
    const rawData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: '' });
    if (!rawData || rawData.length === 0) continue;

    const detectedCategory = matchCategory(sheetName, fallbackCategory);

    // Find the header row (sometimes row 0, 1, or 2 due to title rows like "บัญชีกันตำแหน่ง...")
    let headerRowIdx = -1;
    for (let r = 0; r < Math.min(6, rawData.length); r++) {
      const row = rawData[r];
      if (Array.isArray(row)) {
        const textJoined = row.map(c => String(c).toLowerCase()).join(' ');
        if (textJoined.includes('ลำดับ') || textJoined.includes('เลขตำแหน่ง') || textJoined.includes('ผบ.หมู่') || textJoined.includes('ตำแหน่ง') || textJoined.includes('ผ.')) {
          headerRowIdx = r;
          break;
        }
      }
    }

    if (headerRowIdx === -1) {
      headerRowIdx = 0; // fallback to first row
    }

    const headerRow = rawData[headerRowIdx] as any[];
    // Secondary subheader row check (e.g. Row 1: "ที่กันตำแหน่ง", "บก./บช.", "ที่...", "ลงวันที่")
    const subHeaderRow = (headerRowIdx + 1 < rawData.length) ? (rawData[headerRowIdx + 1] as any[]) : [];

    // Map each column index to a model property
    const colIndexToKey: Record<number, keyof PolicePositionRecord> = {};
    for (let c = 0; c < headerRow.length; c++) {
      const h1 = String(headerRow[c] || '').trim();
      const h2 = String(subHeaderRow[c] || '').trim();
      const combined = `${h1} ${h2}`.trim().toLowerCase();

      // Check direct map
      let matchedKey: keyof PolicePositionRecord | undefined;
      for (const [thaiName, key] of Object.entries(HEADER_MAP)) {
        const cleanThai = thaiName.toLowerCase();
        if (h1.toLowerCase() === cleanThai || h2.toLowerCase() === cleanThai || combined.includes(cleanThai)) {
          matchedKey = key;
          break;
        }
      }

      // Contextual fallbacks
      if (!matchedKey) {
        if (combined.includes('เลขตำแหน่ง') || h1.includes('เลขตำแหน่ง')) matchedKey = 'positionNumber';
        else if (combined.includes('ชื่อ') || combined.includes('สกุล') || h1.includes('ยศ')) matchedKey = 'personRankName';
        else if (combined.includes('บัตร') || combined.includes('ประชาชน')) matchedKey = 'idCard';
        else if (combined.includes('คำสั่ง') || combined.includes('บรรจุ')) matchedKey = 'appointmentOrder';
        else if (combined.includes('มีผล') || combined.includes('ผลวันที่')) matchedKey = 'appointmentEffectiveDate';
        else if (combined.includes('หมายเหตุ')) matchedKey = 'notes';
        else if (combined.includes('บก.') || combined.includes('ภ.จว.')) matchedKey = 'division';
        else if (combined.includes('บช.')) matchedKey = 'bureau';
        else if (combined.includes('สายงาน')) matchedKey = 'lineOfWork';
        else if (combined.includes('ทำหน้าที่')) matchedKey = 'duty';
      }

      if (matchedKey) {
        colIndexToKey[c] = matchedKey;
      }
    }

    // Now extract data rows
    const startDataRow = (subHeaderRow.some(s => String(s).trim().length > 0) && headerRowIdx + 2 < rawData.length && isSubheader(subHeaderRow))
      ? headerRowIdx + 2
      : headerRowIdx + 1;

    const parsedRows: Partial<PolicePositionRecord>[] = [];

    for (let r = startDataRow; r < rawData.length; r++) {
      const row = rawData[r];
      if (!Array.isArray(row) || row.every(cell => !cell || String(cell).trim() === '')) {
        continue; // skip empty rows
      }

      const record: Partial<PolicePositionRecord> = {
        category: detectedCategory,
      };

      for (let c = 0; c < row.length; c++) {
        const key = colIndexToKey[c];
        const val = String(row[c] || '').trim();
        if (key && val) {
          if (key === 'orderNo') {
            const num = parseInt(val, 10);
            record.orderNo = isNaN(num) ? parsedRows.length + 1 : num;
          } else if (key === 'positionNumber') {
            record.positionNumber = formatPositionNumber(val);
          } else {
            (record as any)[key] = val;
          }
        }
      }

      // If category was specified in a row column, override it
      if (record.category && POLICE_CATEGORIES.includes(record.category as PoliceCategory)) {
        // keep it
      } else {
        record.category = detectedCategory;
      }

      // If no position number or name, check if row has enough data to be valid
      if (record.positionNumber || record.personRankName || record.positionName || record.docBookNumber || record.reservationNoDate) {
        if (!record.orderNo) record.orderNo = parsedRows.length + 1;
        parsedRows.push(record);
      }
    }

    resultSheets.push({
      sheetName,
      category: detectedCategory,
      rows: parsedRows,
      totalFound: parsedRows.length
    });

    parsedRows.forEach((r, idx) => {
      combinedRecords.push({
        id: `import-${Date.now()}-${resultSheets.length}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
        category: r.category as PoliceCategory || detectedCategory,
        orderNo: r.orderNo || idx + 1,
        reservationNoDate: r.reservationNoDate || '',
        docOriginUnit: r.docOriginUnit || '',
        docBookNumber: r.docBookNumber || '',
        docDate: r.docDate || '',
        positionNumber: formatPositionNumber(r.positionNumber || ''),
        positionRank: r.positionRank || '',
        positionName: r.positionName || '',
        division: r.division || '',
        bureau: r.bureau || '',
        duty: r.duty || '',
        lineOfWork: r.lineOfWork || '',
        workGroup: r.workGroup || '',
        personRankName: r.personRankName || '',
        idCard: r.idCard || '',
        requestSource: r.requestSource || '',
        appointmentOrder: r.appointmentOrder || '',
        appointmentEffectiveDate: r.appointmentEffectiveDate || '',
        resolutionNo: r.resolutionNo || '',
        transferredRankOrPosition: r.transferredRankOrPosition || '',
        notes: r.notes || '',
        updatedAt: new Date().toISOString(),
        updatedBy: 'นำเข้าจากไฟล์ ' + file.name
      });
    });
  }

  return {
    fileName: file.name,
    sheets: resultSheets,
    allRecords: combinedRecords
  };
}

function isSubheader(row: any[]): boolean {
  const text = row.map(c => String(c).trim()).join(' ');
  return text.includes('ที่กันตำแหน่ง') || text.includes('บก./บช.') || text.includes('ลงวันที่') || text.includes('ประชาชน');
}

/**
 * Convert records to official Excel format
 */
export function exportToExcel(
  records: PolicePositionRecord[],
  exportCategory: PoliceCategory | 'ALL' = 'ALL',
  fileName = 'บัญชีกันตำแหน่งข้าราชการตำรวจ_งานประทวน'
) {
  const wb = XLSX.utils.book_new();

  const categoriesToExport = exportCategory === 'ALL'
    ? POLICE_CATEGORIES
    : [exportCategory];

  for (const cat of categoriesToExport) {
    const catRecords = records.filter(r => r.category === cat);
    if (exportCategory !== 'ALL' || catRecords.length > 0 || categoriesToExport.length <= 13) {
      const headerRows = [
        [`บัญชีกันตำแหน่งข้าราชการตำรวจชั้นประทวน (${cat})`],
        [
          'ลำดับที่',
          'ผ. ....../วันเดือนปีที่กันตำแหน่ง',
          'หน่วยงานเจ้าของเรื่อง (บก./บช.)',
          'เลขที่หนังสือต้นเรื่อง',
          'หนังสือลงวันที่ (ว/ด/ป)',
          'หมวดการกันตำแหน่ง',
          'เลขตำแหน่ง',
          'ระดับตำแหน่ง',
          'ตำแหน่ง/สังกัด/หน่วยงาน',
          'บก.',
          'บช.',
          'ทำหน้าที่',
          'สายงาน',
          'กลุ่มสายงาน',
          'ยศ  ชื่อ  สกุล',
          'เลขประจำตัวประชาชน',
          'ร้องขอจาก...',
          'คำสั่งบรรจุ/ที่',
          'คำสั่งบรรจุมีผลวันที่',
          'มติ ก.ตร. / อ.ก.ตร.',
          'ระดับที่ตัดโอน / ตำแหน่งรองรับ',
          'หมายเหตุ / สถานะ'
        ]
      ];

      const dataRows = catRecords.map((r, i) => [
        i + 1,
        r.reservationNoDate || '',
        r.docOriginUnit || '',
        r.docBookNumber || '',
        r.docDate || '',
        r.category,
        r.positionNumber || '',
        r.positionRank || '',
        r.positionName || '',
        r.division || '',
        r.bureau || '',
        r.duty || '',
        r.lineOfWork || '',
        r.workGroup || '',
        r.personRankName || '',
        r.idCard || '',
        r.requestSource || '',
        r.appointmentOrder || '',
        r.appointmentEffectiveDate || '',
        r.resolutionNo || '',
        r.transferredRankOrPosition || '',
        r.notes || ''
      ]);

      const ws = XLSX.utils.aoa_to_sheet([...headerRows, ...dataRows]);

      // Set nice column widths
      ws['!cols'] = [
        { wch: 8 },  // ลำดับที่
        { wch: 28 }, // ผ.
        { wch: 20 }, // หน่วยงาน
        { wch: 22 }, // เลขหนังสือ
        { wch: 14 }, // ลงวันที่
        { wch: 20 }, // หมวด
        { wch: 18 }, // เลขตำแหน่ง
        { wch: 14 }, // ระดับ
        { wch: 35 }, // ตำแหน่ง/สังกัด
        { wch: 18 }, // บก.
        { wch: 12 }, // บช.
        { wch: 22 }, // ทำหน้าที่
        { wch: 24 }, // สายงาน
        { wch: 22 }, // กลุ่มสายงาน
        { wch: 26 }, // ยศ ชื่อ สกุล
        { wch: 18 }, // บัตรประชาชน
        { wch: 24 }, // ร้องขอ
        { wch: 30 }, // คำสั่งบรรจุ
        { wch: 16 }, // มีผลวันที่
        { wch: 24 }, // มติ ก.ตร.
        { wch: 24 }, // ตัดโอน
        { wch: 20 }, // หมายเหตุ
      ];

      // Sheet name limit is 31 chars in Excel
      const safeSheetName = cat.slice(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, safeSheetName);
    }
  }

  const cleanFileName = `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, cleanFileName);
}

/**
 * Generate standard official template with all 13 sheets ready
 */
export function downloadTemplate() {
  const wb = XLSX.utils.book_new();

  for (const cat of POLICE_CATEGORIES) {
    const headers = [
      [`บัญชีกันตำแหน่งข้าราชการตำรวจชั้นประทวน (${cat}) - แบบฟอร์มกรอกข้อมูลตามระบบสารบรรณ`],
      [
        'ลำดับที่',
        'ผ. ....../วันเดือนปีที่กันตำแหน่ง',
        'หน่วยงานเจ้าของเรื่อง (บก./บช.)',
        'เลขที่หนังสือต้นเรื่อง',
        'หนังสือลงวันที่ (ว/ด/ป)',
        'หมวดการกันตำแหน่ง',
        'เลขตำแหน่ง',
        'ระดับตำแหน่ง',
        'ตำแหน่ง/สังกัด/หน่วยงาน',
        'บก.',
        'บช.',
        'ทำหน้าที่',
        'สายงาน',
        'กลุ่มสายงาน',
        'ยศ  ชื่อ  สกุล',
        'เลขประจำตัวประชาชน',
        'ร้องขอจาก...',
        'คำสั่งบรรจุ/ที่',
        'คำสั่งบรรจุมีผลวันที่',
        'มติ ก.ตร. / อ.ก.ตร.',
        'ระดับที่ตัดโอน / ตำแหน่งรองรับ',
        'หมายเหตุ / สถานะ'
      ],
      [
        1,
        'ผ.10/2568 ลง 10 มี.ค.2568',
        'ภ.จว.ขอนแก่น',
        '0019(ขก).417/1234',
        '5-มี.ค.-68',
        cat,
        '1405 12202 0123',
        'ผบ.หมู่ (ป.)',
        'สภ.เมืองขอนแก่น จว.ขอนแก่น',
        'ภ.จว.ขอนแก่น',
        'ภ.4',
        'ปฏิบัติงานป้องกันปราบปราม',
        'ป้องกันปราบปรามอาชญากรรม',
        'ป้องกันปราบปราม',
        'ส.ต.อ.สมชาย ใจดี',
        '1400600123456',
        '',
        '',
        '',
        '',
        '',
        '(ตัวอย่างการกรอก)'
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(headers);
    ws['!cols'] = [
      { wch: 8 }, { wch: 28 }, { wch: 20 }, { wch: 22 }, { wch: 14 },
      { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 32 }, { wch: 18 },
      { wch: 12 }, { wch: 22 }, { wch: 24 }, { wch: 22 }, { wch: 24 },
      { wch: 18 }, { wch: 24 }, { wch: 28 }, { wch: 16 }, { wch: 24 },
      { wch: 24 }, { wch: 20 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, cat.slice(0, 31));
  }

  XLSX.writeFile(wb, 'แบบฟอร์มบันทึกการกันตำแหน่ง_ตร_13หมวด.xlsx');
}

/**
 * Export single category or all records to CSV format with UTF-8 BOM
 */
export function exportToCsv(records: PolicePositionRecord[], filename = 'export_police_positions.csv') {
  const headers = [
    'ลำดับที่',
    'ผ. ....../วันเดือนปี',
    'กันตำแหน่งตามหนังสือ',
    'ที่...',
    'ลงวันที่',
    'หมวด',
    'เลขตำแหน่ง',
    'ระดับตำแหน่ง',
    'ตำแหน่ง/หน่วยงาน',
    'บก.',
    'บช.',
    'ทำหน้าที่',
    'สายงาน',
    'กลุ่มสายงาน',
    'ยศ  ชื่อ  สกุล',
    'เลขที่บัตรประชาชน',
    'ร้องขอจาก',
    'คำสั่งบรรจุ',
    'มีผลวันที่',
    'มติ ก.ตร.',
    'ระดับที่ตัดโอน',
    'หมายเหตุ'
  ];

  const escapeCsv = (val: any) => {
    const s = String(val ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const rows = records.map((r, i) => [
    i + 1,
    escapeCsv(r.reservationNoDate),
    escapeCsv(r.docOriginUnit),
    escapeCsv(r.docBookNumber),
    escapeCsv(r.docDate),
    escapeCsv(r.category),
    escapeCsv(r.positionNumber),
    escapeCsv(r.positionRank),
    escapeCsv(r.positionName),
    escapeCsv(r.division),
    escapeCsv(r.bureau),
    escapeCsv(r.duty),
    escapeCsv(r.lineOfWork),
    escapeCsv(r.workGroup),
    escapeCsv(r.personRankName),
    escapeCsv(r.idCard),
    escapeCsv(r.requestSource),
    escapeCsv(r.appointmentOrder),
    escapeCsv(r.appointmentEffectiveDate),
    escapeCsv(r.resolutionNo),
    escapeCsv(r.transferredRankOrPosition),
    escapeCsv(r.notes)
  ].join(','));

  // UTF-8 BOM for Thai characters in Excel
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
