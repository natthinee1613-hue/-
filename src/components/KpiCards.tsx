import React from 'react';
import { PolicePositionRecord, StatusFilterType } from '../types/police';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  UserMinus,
  Sparkles,
  Layers
} from 'lucide-react';
import { getStatusBadge } from '../utils/formatters';

interface KpiCardsProps {
  records: PolicePositionRecord[];
  currentCategory: string;
  activeStatusFilter: StatusFilterType;
  onSelectStatusFilter: (status: StatusFilterType) => void;
  isDarkMode: boolean;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ 
  records, 
  currentCategory,
  activeStatusFilter,
  onSelectStatusFilter,
  isDarkMode,
}) => {
  const total = records.length;

  let reservedCount = 0;
  let inProgressCount = 0;
  let pendingErrorCount = 0;
  let vacantCount = 0;

  records.forEach((r) => {
    const badge = getStatusBadge(r);
    if (badge.type === 'RESERVED') {
      reservedCount++;
    } else if (badge.type === 'PENDING_ERROR') {
      pendingErrorCount++;
    } else if (badge.type === 'VACANT') {
      vacantCount++;
    } else {
      inProgressCount++;
    }
  });

  const cards = [
    {
      id: 'ALL' as StatusFilterType,
      title: 'รวมตำแหน่งทั้งหมด',
      count: total,
      unit: 'อัตรา',
      desc: currentCategory === 'ALL' ? 'รวมทั้งสิ้น 13 กลุ่มกรณี' : `หมวด: ${currentCategory}`,
      icon: Layers,
      dotColor: 'bg-slate-500',
      iconBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      activeBorder: isDarkMode ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-[#0f243c] ring-2 ring-[#0f243c]/20',
      numColor: isDarkMode ? 'text-white' : 'text-slate-900',
    },
    {
      id: 'RESERVED' as StatusFilterType,
      title: 'กันตำแหน่งแล้ว',
      count: reservedCount,
      unit: 'อัตรา',
      desc: 'มีคำสั่งบรรจุ/ผลบังคับใช้แล้ว',
      icon: CheckCircle2,
      dotColor: 'bg-emerald-500',
      iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
      activeBorder: isDarkMode ? 'border-emerald-500 ring-2 ring-emerald-500/40' : 'border-emerald-600 ring-2 ring-emerald-600/20',
      numColor: isDarkMode ? 'text-emerald-400' : 'text-emerald-700',
    },
    {
      id: 'IN_PROGRESS' as StatusFilterType,
      title: 'ระหว่างดำเนินการ',
      count: inProgressCount,
      unit: 'อัตรา',
      desc: 'สงวนอัตรา/รอผลพิจารณา',
      icon: Clock,
      dotColor: 'bg-amber-500',
      iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
      activeBorder: isDarkMode ? 'border-amber-500 ring-2 ring-amber-500/40' : 'border-amber-600 ring-2 ring-amber-600/20',
      numColor: isDarkMode ? 'text-amber-400' : 'text-amber-700',
    },
    {
      id: 'PENDING_ERROR' as StatusFilterType,
      title: 'รอตรวจสอบ/มีข้อผิดพลาด',
      count: pendingErrorCount,
      unit: 'อัตรา',
      desc: 'คำสั่งให้ออก/ไล่ออก/มีข้อทักท้วง',
      icon: AlertTriangle,
      dotColor: 'bg-rose-500',
      iconBg: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
      activeBorder: isDarkMode ? 'border-rose-500 ring-2 ring-rose-500/40' : 'border-rose-600 ring-2 ring-rose-600/20',
      numColor: isDarkMode ? 'text-rose-400' : 'text-rose-700',
    },
    {
      id: 'VACANT' as StatusFilterType,
      title: 'ตำแหน่งว่าง',
      count: vacantCount,
      unit: 'อัตรา',
      desc: 'อัตราว่างรอจัดสรร/รอฝึกอบรม',
      icon: UserMinus,
      dotColor: 'bg-blue-500',
      iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
      activeBorder: isDarkMode ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-blue-600 ring-2 ring-blue-600/20',
      numColor: isDarkMode ? 'text-blue-400' : 'text-blue-700',
    },
  ];

  return (
    <div className={`rounded-xl border p-3 sm:p-3.5 transition-all font-['Sarabun'] ${
      isDarkMode 
        ? 'bg-slate-900 border-slate-800 text-slate-100' 
        : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
    }`}>
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span className={`text-sm sm:text-base font-bold flex items-center gap-1.5 ${
            isDarkMode ? 'text-slate-200' : 'text-slate-800'
          }`}>
            ภาพรวมอัตรากำลังพล (คลิกการ์ดเพื่อกรอง)
          </span>
          <span className="text-xs px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hidden sm:inline">
            {currentCategory === 'ALL' ? 'แสดงข้อมูลทุกหมวด' : `หมวด: ${currentCategory}`}
          </span>
        </div>

        {activeStatusFilter !== 'ALL' && (
          <button
            onClick={() => onSelectStatusFilter('ALL')}
            className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900"
          >
            ✕ ล้างตัวกรองสถานะ
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
        {cards.map((c) => {
          const isSelected = activeStatusFilter === c.id;

          return (
            <button
              key={c.id}
              onClick={() => onSelectStatusFilter(isSelected ? 'ALL' : c.id)}
              className={`text-left rounded-lg px-3 py-2 transition-all cursor-pointer relative border ${
                isSelected
                  ? `border-blue-600 ring-2 ring-blue-600/20 shadow-xs ${isDarkMode ? 'bg-slate-800' : 'bg-blue-50/40'}`
                  : isDarkMode
                  ? 'bg-slate-850 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
              title={`${c.title}: ${c.desc}`}
            >
              {/* Top: Icon + Title + Dot */}
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${c.iconBg}`}>
                    <c.icon className="w-3 h-3" />
                  </div>
                  <span className={`text-xs font-semibold truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {c.title}
                  </span>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dotColor}`} />
              </div>

              {/* Bottom: Number + Unit + Tag */}
              <div className="flex items-baseline justify-between gap-1 mt-1.5">
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold font-mono tracking-tight tabular-nums ${c.numColor}`}>
                    {c.count}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {c.unit}
                  </span>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                    กำลังกรอง
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
