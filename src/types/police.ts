export const POLICE_CATEGORIES = [
  'ให้ออกจากราชการไว้ก่อน',
  'กัน รร.นรต.',
  'พักราชการ',
  'กลับเข้ารับราชการ',
  'รับโอนเข้า',
  'การตัดโอน',
  'เลือกตั้ง',
  'ทายาท',
  'นักกีฬา',
  'ผู้มีวุฒิ+นโยบาย',
  'เปิดสอบ',
  'นสต.ปี 2569',
  'ยุบเลิก มติ ก.ตร.',
] as const;

export type PoliceCategory = typeof POLICE_CATEGORIES[number];

export interface CategoryMeta {
  id: PoliceCategory;
  label: string;
  pillBg: string;
  pillText: string;
  pillBorder: string;
  activeBg: string;
  dotColor: string;
  description: string;
}

export interface PolicePositionRecord {
  id: string; // unique ID
  category: PoliceCategory; // 1 in 13 categories
  orderNo: number; // ลำดับที่

  // 1. ข้อมูลทางสารบรรณ (Saraban Info)
  reservationNoDate: string; // ผ. ....../วันเดือนปีที่กันตำแหน่ง (เช่น ผ.38/2567 ลง 24 ก.ย.2567(งาน ส.))
  docOriginUnit: string; // หน่วยงานเจ้าของเรื่อง (บก./บช.) เช่น วน., ภ.จว.ร้อยเอ็ด
  docBookNumber: string; // เลขที่หนังสือต้นเรื่อง (ที่...) เช่น 0006.2/71, 0020(ชม).411/4001
  docDate: string; // หนังสือลงวันที่ (ว/ด/ป) เช่น 26-ส.ค.-67, 4-มิ.ย.-68

  // 2. ข้อมูลโครงสร้างตำแหน่ง (Position Info)
  positionNumber: string; // เลขตำแหน่ง (รูปแบบ xxxx xxxxx xxxx เช่น 1205 12502 1216)
  positionRank: string; // ระดับตำแหน่ง เช่น ผบ.หมู่, ผบ.หมู่ (ป.), ผบ.หมู่ (สส.), รอง สว., รอง สว.(ป.)
  positionName: string; // ตำแหน่ง / สังกัด / หน่วยงาน เช่น สภ.เมืองฉะเชิงเทรา จว.ฉะเชิงเทรา
  division: string; // กองบังคับการ (บก.) เช่น ภ.จว.ฉะเชิงเทรา, ภ.จว.ชลบุรี, บก.สอท.1
  bureau: string; // กองบัญชาการ (บช.) เช่น ภ.1, ภ.2, ภ.3, ภ.4, ภ.5, ภ.6, บช.สอท., บ.ตร.
  duty: string; // ทำหน้าที่ เช่น สืบสวน, ปฏิบัติงานป้องกันปราบปราม, ธุรการ, ช่างอากาศยาน
  lineOfWork: string; // สายงาน เช่น สืบสวน, ป้องกันปราบปรามอาชญากรรม, ธุรการ
  workGroup: string; // กลุ่มสายงาน เช่น สืบสวนสอบสวน, ป้องกันปราบปราม, อำนวยการและสนับสนุน

  // 3. ข้อมูลบุคคล (Personnel Info)
  personRankName: string; // ยศ - ชื่อ - สกุล เช่น ส.ต.อ.อภิสิทธิ์ คนยงค์
  idCard: string; // เลขประจำตัวประชาชน 13 หลัก
  requestSource: string; // ร้องขอจาก... (กรณีกลับเข้ารับราชการ เช่น ก.พ.ค.ตร., คำสั่งศาลปกครอง)

  // 4. ข้อมูลคำสั่งและการบังคับใช้ (Order & Effect)
  appointmentOrder: string; // คำสั่งบรรจุ/ที่ (เช่น คำสั่ง ภ.จว.แพร่ ที่ 377/2568 ลง 19 พ.ย.68)
  appointmentEffectiveDate: string; // คำสั่งบรรจุมีผลวันที่ (ว/ด/ป)
  resolutionNo: string; // มติ ก.ตร. / อ.ก.ตร. ครั้งที่... / เมื่อวันที่... (กรณีตัดโอน/ยุบเลิก)
  transferredRankOrPosition: string; // ระดับที่ตัดโอน / เลขตำแหน่งรอง สว. ที่รองรับ
  notes: string; // หมายเหตุ / สถานะความลับ เช่น (ลับ), ไล่ออก, เพื่อจะสั่งให้ออกฯ, บรรจุแล้ว
  statusBadge?: string; // สถานะสากล (Badge) ตามมาตรฐาน ตร. ที่สามารถแก้ไขได้ทุกคำสั่ง เช่น บรรจุแล้ว, รอดำเนินการ, ไล่ออก, รอสั่งให้ออกฯ, ตำแหน่งว่าง ฯลฯ
  
  updatedAt: string; // ISO date
  updatedBy: string; // ชื่อเจ้าหน้าที่ผู้แก้ไข
}

export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT_EXCEL' | 'BATCH_DELETE' | 'RESET_DATA';

export interface AuditLogItem {
  id: string;
  timestamp: string; // วันที่-เวลา
  officerName: string; // ชื่อเจ้าหน้าที่ผู้แก้ไข
  action: ActionType;
  category: PoliceCategory | 'ALL';
  recordId?: string;
  positionNumber?: string;
  targetPerson?: string;
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  details?: string;
}

export type StatusFilterType = 
  | 'ALL' 
  | 'RESERVED' // กันตำแหน่งแล้ว (เรียบร้อย/มีผล)
  | 'IN_PROGRESS' // ระหว่างดำเนินการ
  | 'PENDING_ERROR' // รอตรวจสอบ/มีข้อผิดพลาด/คำสั่งให้ออก
  | 'VACANT' // ตำแหน่งว่าง (ไม่มีผู้ครอง)
  | 'SECRET'; // เอกสารลับ

export type QuickDutyType = 'ALL' | 'ป.' | 'สส.' | 'จร.' | 'อก.';

export interface FilterState {
  search: string;
  category: PoliceCategory | 'ALL';
  bureau: string;
  division: string;
  duty: string;
  quickDuty: QuickDutyType;
  status: StatusFilterType;
}
