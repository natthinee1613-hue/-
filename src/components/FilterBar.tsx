import React from 'react';
import { FilterState, QuickDutyType, StatusFilterType } from '../types/police';
import { 
  Search, 
  X, 
  Eye, 
  EyeOff, 
  Filter, 
  Trash2, 
  Download, 
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';

interface FilterBarProps {
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  isIdMasked: boolean;
  onToggleMaskId: () => void;
  availableBureaus: string[];
  availableDivisions: string[];
  availableDuties: string[];
  totalFiltered: number;
  totalRecords: number;
  selectedIds: string[];
  onBatchDelete: () => void;
  onBatchExport: () => void;
  onClearSelection: () => void;
  isDarkMode: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  isIdMasked,
  onToggleMaskId,
  availableBureaus,
  availableDivisions,
  availableDuties,
  totalFiltered,
  totalRecords,
  selectedIds,
  onBatchDelete,
  onBatchExport,
  onClearSelection,
  isDarkMode,
}) => {
  const hasActiveFilters =
    filter.search ||
    filter.bureau ||
    filter.division ||
    filter.duty ||
    filter.quickDuty !== 'ALL' ||
    filter.status !== 'ALL';

  const resetFilters = () => {
    onFilterChange({
      ...filter,
      search: '',
      bureau: '',
      division: '',
      duty: '',
      quickDuty: 'ALL',
      status: 'ALL',
    });
  };

  const handleQuickDutySelect = (qd: QuickDutyType) => {
    onFilterChange({
      ...filter,
      quickDuty: qd,
    });
  };

  const quickDutyTabs: { id: QuickDutyType; label: string; full: string; badge: string }[] = [
    { id: 'ALL', label: 'ทุกสายงาน', full: 'สายงานทั้งหมด', badge: 'ทั้งหมด' },
    { id: 'ป.', label: 'ป. (ป้องกันปราบปราม)', full: 'ป้องกันปราบปราม', badge: 'ป.' },
    { id: 'สส.', label: 'สส. (สืบสวน)', full: 'สืบสวน', badge: 'สส.' },
    { id: 'จร.', label: 'จร. (จราจร)', full: 'จราจร', badge: 'จร.' },
    { id: 'อก.', label: 'อก. (อำนวยการ/ธุรการ)', full: 'อำนวยการและสนับสนุน/ธุรการ', badge: 'อก.' },
  ];

  return (
    <div className={`rounded-xl p-2.5 mb-2.5 border transition-colors font-['Sarabun'] ${
      isDarkMode 
        ? 'bg-slate-900 border-slate-800 text-slate-100' 
        : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
    }`}>
      
      {/* Row 1: Unified Search & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
            placeholder="ค้นหา: เลขคำสั่ง, ชื่อ-สกุล, เลขตำแหน่ง, หน่วยงาน, เลขหนังสือ..."
            className={`w-full h-9 pl-9 pr-8 rounded-lg text-xs font-['Sarabun'] focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
              isDarkMode 
                ? 'bg-slate-850 border border-slate-700 text-slate-100 placeholder-slate-500' 
                : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
            }`}
          />
          {filter.search && (
            <button
              onClick={() => onFilterChange({ ...filter, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns & Action Toggles */}
        <div className="flex flex-wrap items-center gap-1.5">
          
          {/* Bureau (บช./ภ.) */}
          <select
            value={filter.bureau}
            onChange={(e) => onFilterChange({ ...filter, bureau: e.target.value, division: '' })}
            className={`h-9 border text-xs rounded-lg px-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 font-['Sarabun'] cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-850 border-slate-700 text-slate-200' 
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="">บช./ภาค ทั้งหมด</option>
            {availableBureaus.map((b) => (
              <option key={b} value={b}>
                บช. {b}
              </option>
            ))}
          </select>

          {/* Division (บก./ภ.จว.) */}
          <select
            value={filter.division}
            onChange={(e) => onFilterChange({ ...filter, division: e.target.value })}
            className={`h-9 border text-xs rounded-lg px-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 max-w-[150px] font-['Sarabun'] cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-850 border-slate-700 text-slate-200' 
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="">บก./ภ.จว. ทั้งหมด</option>
            {availableDivisions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={filter.status}
            onChange={(e) => onFilterChange({ ...filter, status: e.target.value as StatusFilterType })}
            className={`h-9 border text-xs rounded-lg px-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 font-['Sarabun'] cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-850 border-slate-700 text-slate-200' 
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="ALL">สถานะทั้งหมด</option>
            <option value="RESERVED">กันตำแหน่งแล้ว</option>
            <option value="IN_PROGRESS">ระหว่างดำเนินการ</option>
            <option value="PENDING_ERROR">รอตรวจสอบ/ข้อผิดพลาด</option>
            <option value="VACANT">ตำแหน่งว่าง</option>
            <option value="SECRET">เอกสารลับ (ลับ)</option>
          </select>

          {/* Mask ID Toggle Button */}
          <button
            onClick={onToggleMaskId}
            title={isIdMasked ? 'คลิกเพื่อแสดงเลขบัตรประชาชน 13 หลัก' : 'คลิกเพื่อซ่อนเลขบัตรประชาชนตามมาตรการความปลอดภัย'}
            className={`h-9 flex items-center gap-1 px-2.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isIdMasked
                ? isDarkMode
                  ? 'bg-slate-850 text-slate-300 border-slate-700 hover:text-white'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
            }`}
          >
            {isIdMasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-blue-600" />}
            <span className="hidden sm:inline">
              {isIdMasked ? 'ซ่อนบัตร' : 'แสดงบัตร'}
            </span>
          </button>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              title="ล้างตัวกรองทั้งหมด"
              className="h-9 flex items-center gap-1 px-2.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-colors font-medium cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>ล้างค่า</span>
            </button>
          )}

        </div>

      </div>

      {/* Row 2: Quick Line of Work Pills + Count */}
      <div className={`mt-2 pt-2 border-t flex flex-wrap items-center justify-between gap-1.5 ${
        isDarkMode ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div className="flex flex-wrap items-center gap-1">
          <span className={`text-xs font-medium flex items-center gap-1 mr-1 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <SlidersHorizontal className="w-3 h-3 text-slate-400" />
            <span>สายงาน:</span>
          </span>

          {quickDutyTabs.map((tab) => {
            const isSelected = filter.quickDuty === tab.id;
            
            const colorClasses = 
              tab.id === 'ป.'
                ? isSelected
                  ? 'bg-emerald-600 text-white border-emerald-500 font-semibold shadow-2xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : tab.id === 'สส.'
                ? isSelected
                  ? 'bg-amber-600 text-white border-amber-500 font-semibold shadow-2xs'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                : tab.id === 'จร.'
                ? isSelected
                  ? 'bg-rose-600 text-white border-rose-500 font-semibold shadow-2xs'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                : tab.id === 'อก.'
                ? isSelected
                  ? 'bg-sky-600 text-white border-sky-500 font-semibold shadow-2xs'
                  : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800'
                : isSelected
                ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                : isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';

            return (
              <button
                key={tab.id}
                onClick={() => handleQuickDutySelect(tab.id)}
                className={`px-2 py-0.5 rounded text-xs transition-all cursor-pointer border ${colorClasses}`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Result Count Info */}
        <div className={`text-xs font-medium px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${
          isDarkMode ? 'text-slate-300' : 'text-slate-600'
        }`}>
          แสดง <strong className="text-blue-700 dark:text-blue-400 font-bold">{totalFiltered}</strong> / {totalRecords} รายการ
        </div>
      </div>

      {/* Batch Action Bar (Triggered when items are selected) */}
      {selectedIds.length > 0 && (
        <div className="mt-3 pt-3 border-t border-red-500/30 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-red-950/40 via-blue-950/40 to-slate-900/60 -mx-3.5 -mb-3.5 p-3 rounded-b-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs font-semibold text-red-200">
              ติ๊กถูกเลือกแล้ว {selectedIds.length} รายการ (สามารถคลิกลบบรรทัดที่เลือกได้เลยทันที)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBatchExport}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-700/90 hover:bg-emerald-600 text-xs font-medium text-white transition-colors cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>ส่งออกรายการที่เลือก</span>
            </button>

            <button
              onClick={onBatchDelete}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-all shadow-md shadow-red-950/60 hover:scale-105 active:scale-95 cursor-pointer"
              title="คลิกเพื่อลบบรรทัดที่เลือกทั้งหมดทันที"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ลบบรรทัดที่เลือก ({selectedIds.length} รายการ) ทันที</span>
            </button>

            <button
              onClick={onClearSelection}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              ยกเลิกเลือก
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
