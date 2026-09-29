import { CategoryMeta, PoliceCategory, POLICE_CATEGORIES } from '../types/police';

export const CATEGORY_CONFIG: Record<PoliceCategory, CategoryMeta> = {
  'ให้ออกจากราชการไว้ก่อน': {
    id: 'ให้ออกจากราชการไว้ก่อน',
    label: 'ให้ออกจากราชการไว้ก่อน',
    pillBg: 'bg-[#5ce1e6] hover:bg-[#45d4d9]',
    pillText: 'text-slate-950 font-bold',
    pillBorder: 'border-[#29b8be]',
    activeBg: 'bg-[#5ce1e6] text-slate-950 ring-2 ring-white shadow-md font-bold',
    dotColor: 'bg-[#06949b]',
    description: 'กันตำแหน่งข้าราชการตำรวจที่ถูกสั่งให้ออกจากราชการไว้ก่อนเพื่อรอผลการสอบสวนหรือคำสั่ง'
  },
  'กัน รร.นรต.': {
    id: 'กัน รร.นรต.',
    label: 'กัน รร.นรต.',
    pillBg: 'bg-[#cbf478] hover:bg-[#bde866]',
    pillText: 'text-slate-950 font-bold',
    pillBorder: 'border-[#9ec943]',
    activeBg: 'bg-[#cbf478] text-slate-950 ring-2 ring-white shadow-md font-bold',
    dotColor: 'bg-[#7ba81e]',
    description: 'กันตำแหน่งรองรับนักเรียนนายร้อยตำรวจ (รร.นรต.) หรือโควตาฝึกอบรม'
  },
  'พักราชการ': {
    id: 'พักราชการ',
    label: 'พักราชการ',
    pillBg: 'bg-[#ff7ec9] hover:bg-[#f665ba]',
    pillText: 'text-slate-950 font-bold',
    pillBorder: 'border-[#e045a1]',
    activeBg: 'bg-[#ff7ec9] text-slate-950 ring-2 ring-white shadow-md font-bold',
    dotColor: 'bg-[#db2594]',
    description: 'กันตำแหน่งข้าราชการตำรวจระหว่างถูกสั่งพักราชการ'
  },
  'กลับเข้ารับราชการ': {
    id: 'กลับเข้ารับราชการ',
    label: 'กลับเข้ารับราชการ',
    pillBg: 'bg-[#7def4f] hover:bg-[#68df37]',
    pillText: 'text-slate-950 font-bold',
    pillBorder: 'border-[#4ebd1c]',
    activeBg: 'bg-[#7def4f] text-slate-950 ring-2 ring-white shadow-md font-bold',
    dotColor: 'bg-[#3ca10e]',
    description: 'กันตำแหน่งรองรับผู้ได้รับคำวินิจฉัย/คำสั่งให้กลับเข้ารับราชการ (ก.พ.ค.ตร./ศาล)'
  },
  'รับโอนเข้า': {
    id: 'รับโอนเข้า',
    label: 'รับโอนเข้า',
    pillBg: 'bg-[#00c5f9] hover:bg-[#00aee0]',
    pillText: 'text-slate-950 font-bold',
    pillBorder: 'border-[#0092bd]',
    activeBg: 'bg-[#00c5f9] text-slate-950 ring-2 ring-white shadow-md font-bold',
    dotColor: 'bg-[#007ba1]',
    description: 'กันตำแหน่งรองรับการรับโอนข้าราชการพลเรือน ทหาร หรือหน่วยงานอื่นเข้า ตร.'
  },
  'การตัดโอน': {
    id: 'การตัดโอน',
    label: 'การตัดโอน',
    pillBg: 'bg-[#ffff99] hover:bg-[#f5f57a]',
    pillText: 'text-slate-950 font-bold',
    pillBorder: 'border-[#d4d455]',
    activeBg: 'bg-[#ffff99] text-slate-950 ring-2 ring-white shadow-md font-bold',
    dotColor: 'bg-[#b3b31b]',
    description: 'กันตำแหน่งสำหรับการตัดโอนอัตรากำลังพลระหว่างหน่วยงานในสำนักงานตำรวจแห่งชาติ'
  },
  'เลือกตั้ง': {
    id: 'เลือกตั้ง',
    label: 'เลือกตั้ง',
    pillBg: 'bg-[#ff4d4f] hover:bg-[#ea3a3c]',
    pillText: 'text-slate-950 font-bold',
    pillBorder: 'border-[#c72628]',
    activeBg: 'bg-[#ff4d4f] text-slate-950 ring-2 ring-white shadow-md font-bold',
    dotColor: 'bg-[#b31416]',
    description: 'กันตำแหน่งรองรับการลาเพื่อสมัครรับเลือกตั้งตามกฎหมาย'
  },
  'ทายาท': {
    id: 'ทายาท',
    label: 'ทายาท',
    pillBg: 'bg-[#75a2ff] hover:bg-[#5b8eff]',
    pillText: 'text-slate-950 font-bold',
    pillBorder: 'border-[#4374e6]',
    activeBg: 'bg-[#75a2ff] text-slate-950 ring-2 ring-white shadow-md font-bold',
    dotColor: 'bg-[#2956c4]',
    description: 'กันตำแหน่งบรรจุทายาทผู้ปฏิบัติหน้าที่เสียชีวิตหรือทุพพลภาพจากการปฏิบัติหน้าที่'
  },
  'นักกีฬา': {
    id: 'นักกีฬา',
    label: 'นักกีฬา',
    pillBg: 'bg-[#ffff55] hover:bg-[#ecec36]',
    pillText: 'text-slate-950 font-bold',
    pillBorder: 'border-[#d3ce16]',
    activeBg: 'bg-[#ffff55] text-slate-950 ring-2 ring-white shadow-md font-bold',
    dotColor: 'bg-[#a39f03]',
    description: 'กันตำแหน่งรองรับนักกีฬาทีมชาติและผู้มีความสามารถพิเศษทางกีฬา'
  },
  'ผู้มีวุฒิ+นโยบาย': {
    id: 'ผู้มีวุฒิ+นโยบาย',
    label: 'ผู้มีวุฒิ+นโยบาย',
    pillBg: 'bg-[#ba5ef9] hover:bg-[#a943ee]',
    pillText: 'text-slate-950 font-bold',
    pillBorder: 'border-[#8923d1]',
    activeBg: 'bg-[#ba5ef9] text-slate-950 ring-2 ring-white shadow-md font-bold',
    dotColor: 'bg-[#720fae]',
    description: 'กันตำแหน่งบรรจุผู้มีวุฒิปริญญาเฉพาะทางและนโยบายความต้องการพิเศษของ ตร.'
  },
  'เปิดสอบ': {
    id: 'เปิดสอบ',
    label: 'เปิดสอบ',
    pillBg: 'bg-[#5ce7df] hover:bg-[#43d9d0]',
    pillText: 'text-slate-950 font-bold',
    pillBorder: 'border-[#22b7ae]',
    activeBg: 'bg-[#5ce7df] text-slate-950 ring-2 ring-white shadow-md font-bold',
    dotColor: 'bg-[#0f8e86]',
    description: 'กันตำแหน่งสำหรับเปิดสอบแข่งขันบุคคลภายนอกเข้าเป็นข้าราชการตำรวจ'
  },
  'นสต.ปี 2569': {
    id: 'นสต.ปี 2569',
    label: 'นสต.ปี 2569',
    pillBg: 'bg-[#9f65f8] hover:bg-[#8946ed]',
    pillText: 'text-slate-950 font-bold',
    pillBorder: 'border-[#6f2cd1]',
    activeBg: 'bg-[#9f65f8] text-slate-950 ring-2 ring-white shadow-md font-bold',
    dotColor: 'bg-[#561cb0]',
    description: 'กันตำแหน่งรองรับนักเรียนนายสิบตำรวจ (นสต.) รุ่นประจำปี พ.ศ. 2569'
  },
  'ยุบเลิก มติ ก.ตร.': {
    id: 'ยุบเลิก มติ ก.ตร.',
    label: 'ยุบเลิก มติ ก.ตร.',
    pillBg: 'bg-[#fcfce8] hover:bg-[#f1f1d1]',
    pillText: 'text-slate-950 font-bold underline decoration-[#15803d] decoration-[2.5px] underline-offset-4',
    pillBorder: 'border-[#c4c497]',
    activeBg: 'bg-[#fcfce8] text-slate-950 ring-2 ring-white shadow-md font-bold underline decoration-[#15803d] decoration-[2.5px] underline-offset-4',
    dotColor: 'bg-[#15803d]',
    description: 'กันตำแหน่งหรือจัดการตำแหน่งตามมติ ก.ตร. ในการปรับปรุงโครงสร้างหรือยุบเลิก'
  },
};

/**
 * Format police position number to official format: "xxxx xxxxx xxxx"
 */
export function formatPositionNumber(val: string | undefined | null): string {
  if (!val) return '';
  const clean = val.replace(/\s+/g, '').replace(/[^\d]/g, '');
  if (clean.length === 0) return val.trim();
  
  if (clean.length <= 4) return clean;
  if (clean.length <= 9) return `${clean.slice(0, 4)} ${clean.slice(4)}`;
  return `${clean.slice(0, 4)} ${clean.slice(4, 9)} ${clean.slice(9, 13)}`;
}

/**
 * Clean & normalize Thai position number
 */
export function normalizePositionNumber(val: string): string {
  if (!val) return '';
  const digits = val.replace(/[^\d]/g, '');
  if (digits.length === 13) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 9)} ${digits.slice(9, 13)}`;
  }
  return val.trim();
}

/**
 * Format Thai Citizen ID (13 digits)
 * If masked is true: "3-2096-*****--66"
 * If masked is false: "3-2096-00261-56-6"
 */
export function formatCitizenId(id: string | undefined | null, masked = true): string {
  if (!id) return '-';
  const clean = id.replace(/[^\d]/g, '');
  if (clean.length !== 13) return id; // return original if not standard 13 digits

  if (masked) {
    return `${clean.slice(0, 1)}-${clean.slice(1, 5)}-*****--${clean.slice(11, 13)}`;
  }
  return `${clean.slice(0, 1)}-${clean.slice(1, 5)}-${clean.slice(5, 10)}-${clean.slice(10, 12)}-${clean.slice(12, 13)}`;
}

/**
 * Detect status label and color badge with international color conventions:
 * Green = Completed / Appointed (เรียบร้อย)
 * Amber/Yellow = In Progress / Pending (รอดำเนินการ)
 * Red = Error / Dismissal / Discharged (มีข้อผิดพลาด / ไล่ออก)
 * Slate/Blue = Vacant / Awaiting assignment (ตำแหน่งว่าง)
 */
export function getStatusBadge(record: { 
  appointmentOrder?: string; 
  notes?: string; 
  resolutionNo?: string;
  personRankName?: string;
  statusBadge?: string;
}) {
  const customBadge = record.statusBadge?.trim();
  if (customBadge) {
    if (customBadge === 'บรรจุแล้ว' || customBadge === 'RESERVED') {
      return {
        type: 'RESERVED',
        text: 'เรียบร้อย (บรรจุแล้ว)',
        badge: 'บรรจุแล้ว',
        darkColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        lightColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        icon: 'check-circle-2',
      };
    }
    if (customBadge === 'รอดำเนินการ' || customBadge === 'IN_PROGRESS') {
      return {
        type: 'IN_PROGRESS',
        text: 'ระหว่างดำเนินการ (สงวนตำแหน่ง)',
        badge: 'รอดำเนินการ',
        darkColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        lightColor: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        icon: 'clock',
      };
    }
    if (customBadge.includes('ไล่ออก') || customBadge === 'DISMISS') {
      return {
        type: 'PENDING_ERROR',
        text: 'ไล่ออก / มีคำสั่งพ้น',
        badge: 'ไล่ออก',
        darkColor: 'bg-red-500/20 text-red-300 border-red-500/40',
        lightColor: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500',
        icon: 'alert-circle',
      };
    }
    if (customBadge.includes('รอสั่งให้ออก') || customBadge.includes('เพื่อจะสั่งให้ออก') || customBadge === 'PENDING_OUT') {
      return {
        type: 'PENDING_ERROR',
        text: 'รอสั่งให้ออกฯ',
        badge: 'รอสั่งให้ออก',
        darkColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        lightColor: 'bg-orange-50 text-orange-700 border-orange-200',
        dot: 'bg-orange-500',
        icon: 'alert-triangle',
      };
    }
    if (customBadge.includes('ลาออก') || customBadge === 'RESIGNED') {
      return {
        type: 'PENDING_ERROR',
        text: 'ลาออกจากราชการ',
        badge: 'ลาออก',
        darkColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        lightColor: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        icon: 'user-x',
      };
    }
    if (customBadge.includes('ตำแหน่งว่าง') || customBadge === 'VACANT') {
      return {
        type: 'VACANT',
        text: 'ตำแหน่งว่าง (รอจัดสรร)',
        badge: 'ตำแหน่งว่าง',
        darkColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        lightColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dot: 'bg-indigo-400',
        icon: 'users',
      };
    }
    if (customBadge.includes('กันตำแหน่งแล้ว') || customBadge === 'HELD') {
      return {
        type: 'RESERVED',
        text: 'กันตำแหน่งแล้ว (ตามคำสั่ง)',
        badge: 'กันตำแหน่งแล้ว',
        darkColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
        lightColor: 'bg-teal-50 text-teal-700 border-teal-200',
        dot: 'bg-teal-500',
        icon: 'shield-check',
      };
    }
    if (customBadge.includes('พักราชการ') || customBadge === 'SUSPENDED') {
      return {
        type: 'PENDING_ERROR',
        text: 'สั่งพักราชการ',
        badge: 'พักราชการ',
        darkColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        lightColor: 'bg-purple-50 text-purple-700 border-purple-200',
        dot: 'bg-purple-500',
        icon: 'pause-circle',
      };
    }
    if (customBadge.includes('ตัดโอน') || customBadge === 'TRANSFERRED') {
      return {
        type: 'IN_PROGRESS',
        text: 'ตัดโอนตำแหน่งแล้ว',
        badge: 'ตัดโอนแล้ว',
        darkColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        lightColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        dot: 'bg-cyan-500',
        icon: 'arrow-right-circle',
      };
    }
    if (customBadge.includes('ปฏิบัติราชการ') || customBadge === 'ACTIVE') {
      return {
        type: 'RESERVED',
        text: 'ปฏิบัติหน้าที่ตามปกติ',
        badge: 'ปฏิบัติราชการ',
        darkColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        lightColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        icon: 'check-circle-2',
      };
    }
    return {
      type: 'CUSTOM',
      text: customBadge,
      badge: customBadge,
      darkColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      lightColor: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
      icon: 'bookmark',
    };
  }

  const notes = record.notes || '';
  const order = record.appointmentOrder || '';
  const person = record.personRankName || '';

  // Red: Errors / Dismissals / Disciplinary discharge
  if (notes.includes('ไล่ออก')) {
    return {
      type: 'PENDING_ERROR',
      text: 'ไล่ออก / มีคำสั่งพ้น',
      badge: 'ไล่ออก',
      darkColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      lightColor: 'bg-red-50 text-red-700 border-red-200',
      dot: 'bg-red-500',
      icon: 'alert-circle',
    };
  }
  if (notes.includes('เพื่อจะสั่งให้ออก')) {
    return {
      type: 'PENDING_ERROR',
      text: 'รอสั่งให้ออกฯ',
      badge: 'รอสั่งให้ออก',
      darkColor: 'bg-red-500/15 text-red-300 border-red-500/30',
      lightColor: 'bg-red-50 text-red-700 border-red-200',
      dot: 'bg-red-500',
      icon: 'alert-triangle',
    };
  }
  if (notes.includes('ลาออก')) {
    return {
      type: 'PENDING_ERROR',
      text: 'ลาออกจากราชการ',
      badge: 'ลาออก',
      darkColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      lightColor: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      icon: 'user-x',
    };
  }

  // Green: Completed / Appointed / Effective order
  if (order.trim().length > 0 || notes.includes('บรรจุแล้ว') || notes.includes('กันตำแหน่งแล้ว')) {
    return {
      type: 'RESERVED',
      text: 'เรียบร้อย (มีคำสั่งบรรจุ/กันตำแหน่งแล้ว)',
      badge: 'บรรจุแล้ว',
      darkColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      lightColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      icon: 'check-circle-2',
    };
  }

  // Vacant check
  if (notes.includes('ตำแหน่งว่าง') || !person || person.trim().length === 0 || person.includes('ว่าง') || person.includes('รอจบ')) {
    return {
      type: 'VACANT',
      text: 'ตำแหน่งว่าง (รอจัดสรร)',
      badge: 'ตำแหน่งว่าง',
      darkColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      lightColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      dot: 'bg-indigo-400',
      icon: 'users',
    };
  }

  // Yellow / Amber: In Progress / Active reservation
  return {
    type: 'IN_PROGRESS',
    text: 'ระหว่างดำเนินการ (สงวนตำแหน่ง)',
    badge: 'รอดำเนินการ',
    darkColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    lightColor: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    icon: 'clock',
  };
}

/**
 * Formats current date-time for Saraban logs in Thai
 */
export function getThaiDateTimeNow(): string {
  const now = new Date();
  const thaiYear = now.getFullYear() + 543;
  const day = String(now.getDate()).padStart(2, '0');
  const monthNames = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  const month = monthNames[now.getMonth()];
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${thaiYear} ${hours}:${minutes} น.`;
}
