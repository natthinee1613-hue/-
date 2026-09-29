import React, { useState } from 'react';
import { PoliceCategory, PolicePositionRecord, POLICE_CATEGORIES } from '../types/police';
import { 
  formatCitizenId, 
  getStatusBadge, 
  CATEGORY_CONFIG,
  formatPositionNumber
} from '../utils/formatters';
import { 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  X, 
  Lock, 
  ArrowUpDown, 
  CheckSquare, 
  Square,
  AlertCircle,
  FileText,
  Eye,
  Save,
  Minimize2,
  Maximize2,
  Columns,
  Layers,
  Table
} from 'lucide-react';

interface DataTableProps {
  records: PolicePositionRecord[];
  isIdMasked: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEditRecord: (record: PolicePositionRecord) => void;
  onDeleteRecord: (record: PolicePositionRecord) => void;
  onDuplicateRecord: (record: PolicePositionRecord) => void;
  onSaveInlineEdit: (recordId: string, updatedFields: Partial<PolicePositionRecord>) => void;
  onBatchDelete?: () => void;
  onClearSelection?: () => void;
  onViewDetail: (record: PolicePositionRecord) => void;
  isDarkMode: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  records,
  isIdMasked,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEditRecord,
  onDeleteRecord,
  onDuplicateRecord,
  onSaveInlineEdit,
  onBatchDelete,
  onClearSelection,
  onViewDetail,
  isDarkMode,
}) => {
  // Inline edit state - full record state for editing any/all columns
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineFormData, setInlineFormData] = useState<Partial<PolicePositionRecord>>({});

  // Pagination
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Sorting
  const [sortField, setSortField] = useState<keyof PolicePositionRecord>('orderNo');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof PolicePositionRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRecords = [...records].sort((a, b) => {
    const valA = a[sortField] ?? '';
    const valB = b[sortField] ?? '';
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }
    const strA = String(valA).toLowerCase();
    const strB = String(valB).toLowerCase();
    return sortDirection === 'asc'
      ? strA.localeCompare(strB, 'th')
      : strB.localeCompare(strA, 'th');
  });

  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Start editing: copy ALL fields into inlineFormData
  const startInlineEdit = (record: PolicePositionRecord) => {
    setInlineEditingId(record.id);
    setInlineFormData({
      ...record,
      statusBadge: record.statusBadge || getStatusBadge(record).badge,
    });
  };

  const cancelInlineEdit = () => {
    setInlineEditingId(null);
    setInlineFormData({});
  };

  const saveInlineEdit = (recordId: string) => {
    onSaveInlineEdit(recordId, inlineFormData);
    setInlineEditingId(null);
    setInlineFormData({});
  };

  const isAllSelected = records.length > 0 && selectedIds.length === records.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < records.length;

  // Compact density & view mode states
  const [isCompactDensity, setIsCompactDensity] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'all' | 'summary'>('all');

  // If user enters inline editing mode, auto-expand to all fields
  const activeViewMode = inlineEditingId ? 'all' : viewMode;

  const cellPad = isCompactDensity ? 'py-1.5 px-2' : 'py-3 px-3.5';

  const getDutyBadgeClasses = (duty: string) => {
    if (duty?.includes('สส') || duty?.includes('สืบสวน')) {
      return isDarkMode ? 'bg-amber-950/60 text-amber-300 border-amber-800' : 'bg-amber-100 text-amber-900 border-amber-300';
    }
    if (duty?.includes('จร') || duty?.includes('จราจร')) {
      return isDarkMode ? 'bg-rose-950/60 text-rose-300 border-rose-800' : 'bg-rose-100 text-rose-900 border-rose-300';
    }
    if (duty?.includes('อก') || duty?.includes('อำนวย') || duty?.includes('ธุรการ')) {
      return isDarkMode ? 'bg-sky-950/60 text-sky-300 border-sky-800' : 'bg-sky-100 text-sky-900 border-sky-300';
    }
    return isDarkMode ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' : 'bg-emerald-100 text-emerald-900 border-emerald-300';
  };

  // Reusable input styling for dark/light modes
  const inputClass = isDarkMode
    ? 'w-full bg-[#0f172a] border border-slate-600 focus:border-blue-500 text-white rounded px-2.5 py-1 text-xs outline-none shadow-xs'
    : 'w-full bg-white border border-slate-300 focus:border-blue-600 text-slate-900 rounded px-2.5 py-1 text-xs outline-none shadow-xs';

  return (
    <div className={`rounded-xl shadow-xs overflow-hidden flex flex-col border transition-colors ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      
      {/* Sleek Table Header Action Bar (Compact density & View Mode switches) */}
      <div className={`px-3 py-1.5 border-b flex flex-wrap items-center justify-between gap-2 text-xs transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
      }`}>
        <div className="flex items-center gap-2 font-['Sarabun']">
          <span className="font-bold flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200">
            <Table className="w-3.5 h-3.5 text-blue-600" />
            <span>ตารางสารบรรณการกันตำแหน่ง</span>
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium font-mono ${
            isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}>
            {records.length} รายการ
          </span>
          <span className="hidden sm:inline text-[11px] text-slate-400">
            (ดับเบิลคลิกแถวเพื่อแก้ไขข้อมูลทันที)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle: 18 Columns vs Summary 9 Columns */}
          <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('all')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer ${
                activeViewMode === 'all'
                  ? 'bg-white dark:bg-slate-900 font-bold text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="แสดงคอลัมน์ครบทุกข้อมูลสารบรรณและโครงสร้างตำแหน่ง (18 คอลัมน์)"
            >
              <Columns className="w-3 h-3" />
              <span>ครบ 18 ช่อง</span>
            </button>

            <button
              onClick={() => setViewMode('summary')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer ${
                activeViewMode === 'summary'
                  ? 'bg-white dark:bg-slate-900 font-bold text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="แสดงเฉพาะข้อมูลสำคัญที่จำเป็น สบายตา ไม่ต้องเลื่อนแนวนอนมาก (สรุปย่อ ดูง่าย 9 ช่อง)"
            >
              <Layers className="w-3 h-3" />
              <span>สรุปย่อ ดูง่าย (9 ช่อง)</span>
            </button>
          </div>

          {/* Density Toggle: Compact vs Normal */}
          <button
            onClick={() => setIsCompactDensity(!isCompactDensity)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
              isCompactDensity
                ? isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-blue-400'
                  : 'bg-slate-100 border-slate-300 text-blue-700'
                : isDarkMode
                ? 'bg-slate-850 border-slate-700 text-slate-300'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
            title={isCompactDensity ? 'เปลี่ยนเป็นแถวขนาดปกติ (สบายตา)' : 'เปลี่ยนเป็นแถวกระชับ (เห็นข้อมูลเยอะขึ้น)'}
          >
            {isCompactDensity ? (
              <>
                <Minimize2 className="w-3 h-3 text-blue-500" />
                <span>แถวกระชับ</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3 text-slate-500" />
                <span>แถวปกติ</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Quick Batch Delete Alert Bar inside Table */}
      {selectedIds.length > 0 && onBatchDelete && (
        <div className="bg-red-50 dark:bg-red-950/50 border-b border-red-200 dark:border-red-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-semibold text-red-900 dark:text-red-200">
              เลือกอยู่ {selectedIds.length} รายการ (สามารถคลิกลบบรรทัดที่เลือกได้ทันที)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBatchDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ลบ {selectedIds.length} รายการที่เลือก</span>
            </button>
            {onClearSelection && (
              <button
                onClick={onClearSelection}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer text-xs"
              >
                ยกเลิก
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Active Edit Banner across all 18 fields */}
      {inlineEditingId && (
        <div className={`border-b px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs sticky top-0 z-30 ${
          isDarkMode
            ? 'bg-slate-900 border-blue-500/60 text-white'
            : 'bg-blue-50 border-blue-200 text-slate-900'
        }`}>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
            </span>
            <span className="font-bold text-blue-900 dark:text-blue-300">
              กำลังแก้ไขข้อมูลทุกช่อง (แถวที่ {inlineFormData.orderNo ?? '-'}: {inlineFormData.positionNumber || inlineFormData.personRankName || 'รายการนี้'})
            </span>
            <span className="hidden md:inline text-slate-600 dark:text-slate-300 text-[11px]">
              - แก้ไขได้ครบทั้ง 18 ช่องข้อมูล (ลำดับ, ผ., หน่วยต้นเรื่อง, ที่หนังสือ, ลงวันที่, หมวด, เลขตำแหน่ง, ระดับ, ตำแหน่ง, บก., บช., หน้าที่/สายงาน, ยศ-ชื่อ, บัตร ปชช., คำสั่งบรรจุ, มีผลวันที่, มติ ก.ตร., สถานะ Badge)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => saveInlineEdit(inlineEditingId)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>บันทึกการแก้ไขทุกช่อง</span>
            </button>
            <button
              onClick={cancelInlineEdit}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>ยกเลิก</span>
            </button>
          </div>
        </div>
      )}

      {/* Global Datalists for police rank & bureau autocomplete */}
      <datalist id="inline-ranks">
        <option value="ผบ.หมู่" />
        <option value="ผบ.หมู่ (ป.)" />
        <option value="ผบ.หมู่ (สส.)" />
        <option value="ผบ.หมู่ (จร.)" />
        <option value="ผบ.หมู่ (อก.)" />
        <option value="รอง สว." />
        <option value="รอง สว.(ป.)" />
        <option value="รอง สว.(สส.)" />
        <option value="สว." />
        <option value="รอง ผกก." />
      </datalist>

      <datalist id="inline-bureaus">
        <option value="ภ.1" />
        <option value="ภ.2" />
        <option value="ภ.3" />
        <option value="ภ.4" />
        <option value="ภ.5" />
        <option value="ภ.6" />
        <option value="ภ.7" />
        <option value="ภ.8" />
        <option value="ภ.9" />
        <option value="บช.ก." />
        <option value="บช.สอท." />
        <option value="บช.น." />
        <option value="วน." />
        <option value="สง.ก.ตร." />
        <option value="บ.ตร." />
      </datalist>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto relative min-h-[420px]">
        <table className="w-full text-left text-xs border-collapse font-['Sarabun']">
          
          {/* Grouped Header Rows */}
          <thead>
            {activeViewMode === 'summary' ? (
              /* Compact Summary Mode Single Header (10 columns) */
              <tr className="font-['Sarabun'] font-bold border-b text-xs sticky top-0 z-10 shadow-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                <th className="py-2 px-2 w-9 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500">
                  <button
                    onClick={onToggleSelectAll}
                    className="hover:opacity-80 cursor-pointer"
                    title="เลือกทั้งหมด"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    ) : isIndeterminate ? (
                      <div className="w-3.5 h-3.5 rounded bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-800 dark:text-white text-[9px]">
                        -
                      </div>
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </th>

                <th 
                  onClick={() => handleSort('orderNo')} 
                  className="py-2 px-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-center whitespace-nowrap min-w-[50px]"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>ลำดับ</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th 
                  onClick={() => handleSort('category')} 
                  className="py-2 px-2.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 whitespace-nowrap min-w-[130px]"
                >
                  <div className="flex items-center gap-1">
                    <span>หมวดการกันตำแหน่ง</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th 
                  onClick={() => handleSort('positionNumber')} 
                  className="py-2 px-2.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 whitespace-nowrap min-w-[140px]"
                >
                  <div className="flex items-center gap-1">
                    <span>เลขตำแหน่ง</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th className="py-2 px-2.5 border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 whitespace-nowrap min-w-[190px]">
                  ระดับ / ตำแหน่ง / สังกัด
                </th>

                <th className="py-2 px-2.5 border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-center whitespace-nowrap min-w-[105px]">
                  บช. / สายงาน
                </th>

                <th 
                  onClick={() => handleSort('personRankName')} 
                  className="py-2 px-2.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 whitespace-nowrap min-w-[170px]"
                >
                  <div className="flex items-center gap-1">
                    <span>ยศ - ชื่อ - สกุล / บัตร ปชช.</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th className="py-2 px-2.5 border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 whitespace-nowrap min-w-[150px]">
                  คำสั่งบรรจุ / มีผล / มติ
                </th>

                <th className="py-2 px-2.5 border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-center whitespace-nowrap min-w-[110px]">
                  สถานะ
                </th>

                <th className="py-2 px-2.5 text-center font-semibold border-l border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 min-w-[125px]">
                  จัดการ
                </th>
              </tr>
            ) : (
              <>
                {/* Top Tier Category Headings */}
                <tr className="font-['Sarabun'] font-bold border-b text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  <th className="py-1.5 px-2 w-9 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500">
                    <button
                      onClick={onToggleSelectAll}
                      className="hover:opacity-80 cursor-pointer"
                      title="เลือกทั้งหมด"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      ) : isIndeterminate ? (
                        <div className="w-3.5 h-3.5 rounded bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-800 dark:text-white text-[9px]">
                          -
                        </div>
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  </th>
                  
                  {/* 1. สารบรรณ */}
                  <th colSpan={5} className="py-1.5 px-2.5 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold tracking-wide">
                    📄 1. ข้อมูลสารบรรณ
                  </th>

                  {/* 2. โครงสร้างตำแหน่ง */}
                  <th colSpan={7} className="py-1.5 px-2.5 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold tracking-wide">
                    🏛️ 2. โครงสร้างตำแหน่ง
                  </th>

                  {/* 3. ข้อมูลบุคคล */}
                  <th colSpan={2} className="py-1.5 px-2.5 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold tracking-wide">
                    👮 3. ข้อมูลบุคคล
                  </th>

                  {/* 4. มติ/คำสั่งและการมีผล */}
                  <th colSpan={4} className="py-1.5 px-2.5 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold tracking-wide">
                    ⚖️ 4. มติ/คำสั่ง/สถานะ
                  </th>

                  {/* เครื่องมือ */}
                  <th className="py-1.5 px-2.5 text-center font-semibold border-l border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 min-w-[145px]">
                    ⚙️ จัดการ
                  </th>
                </tr>

                {/* Second Tier Column Names */}
                <tr className="font-['Sarabun'] font-semibold border-b sticky top-0 z-10 shadow-xs text-xs bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300">
                  
                  <th className="py-1.5 px-1.5 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 w-9">
                    #
                  </th>

                  {/* 1. สารบรรณ Columns */}
                  <th 
                    onClick={() => handleSort('orderNo')} 
                    className="py-1.5 px-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[50px] text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>ลำดับ</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  <th className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[130px]">
                    ผ. ....../วันเดือนปี
                  </th>

                  <th className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[100px]">
                    หน่วยต้นเรื่อง
                  </th>

                  <th className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[100px]">
                    เลขที่หนังสือ (ที่...)
                  </th>

                  <th className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[85px]">
                    ลงวันที่
                  </th>

                  {/* 2. โครงสร้างตำแหน่ง Columns */}
                  <th className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[125px]">
                    หมวดการกัน
                  </th>

                  {/* เลขตำแหน่ง */}
                  <th 
                    onClick={() => handleSort('positionNumber')} 
                    className="py-1.5 px-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 whitespace-nowrap min-w-[145px]"
                  >
                    <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                      <span>เลขตำแหน่ง</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  <th className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[70px]">
                    ระดับ
                  </th>

                  <th className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[185px]">
                    ตำแหน่ง/สังกัด/หน่วยงาน
                  </th>

                  <th className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[105px]">
                    บก./ภ.จว.
                  </th>

                  <th 
                    onClick={() => handleSort('bureau')} 
                    className="py-1.5 px-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 whitespace-nowrap min-w-[65px] text-center"
                  >
                    <div className="flex items-center justify-center gap-1 text-slate-700 dark:text-slate-300">
                      <span>บช./ภ.</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  <th className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[115px]">
                    ทำหน้าที่ / สายงาน
                  </th>

                  {/* 3. ข้อมูลบุคคล Columns */}
                  <th 
                    onClick={() => handleSort('personRankName')} 
                    className="py-1.5 px-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 whitespace-nowrap min-w-[150px]"
                  >
                    <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <span>ยศ - ชื่อ - สกุล</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  <th className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[125px]">
                    เลขประจำตัวประชาชน
                  </th>

                  {/* 4. คำสั่ง / มติ Columns */}
                  <th className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[150px]">
                    คำสั่งบรรจุ / ที่
                  </th>

                  <th className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[85px]">
                    มีผลวันที่
                  </th>

                  <th className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[115px]">
                    มติ ก.ตร. / ตัดโอน
                  </th>

                  <th className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[115px]">
                    สถานะสากล
                  </th>

                  {/* เครื่องมือ */}
                  <th className="py-1.5 px-2 text-center whitespace-nowrap min-w-[145px] font-semibold border-l border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                    จัดการ
                  </th>

                </tr>
              </>
            )}
          </thead>

          {/* Table Body with High Readability Padding & Spacing */}
          <tbody className={`divide-y text-xs ${
            isDarkMode 
              ? 'divide-slate-800/80 text-slate-100' 
              : 'divide-slate-200 text-slate-800'
          }`}>
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={activeViewMode === 'summary' ? 10 : 20} className="py-14 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-9 h-9 text-slate-400" />
                    <span className="text-sm font-semibold">ไม่พบข้อมูลตามเงื่อนไขที่กำหนด</span>
                    <span className="text-xs text-slate-400">
                      กรุณาปรับตัวกรอง หรือคลิก "+ เพิ่มรายการ" เพื่อเริ่มบันทึก
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record, index) => {
                const isSelected = selectedIds.includes(record.id);
                const isInlineEditing = inlineEditingId === record.id;
                const status = getStatusBadge(record);
                const catConfig = CATEGORY_CONFIG[record.category];
                const isSecret = record.notes.includes('ลับ');

                return (
                  <tr
                    key={record.id}
                    onDoubleClick={() => !isInlineEditing && startInlineEdit(record)}
                    title={!isInlineEditing ? "ดับเบิลคลิกเพื่อแก้ไขข้อมูลทุกช่องในแถวนี้ทันที" : undefined}
                    className={`transition-colors group ${
                      isInlineEditing
                        ? isDarkMode ? 'bg-slate-800 ring-1 ring-blue-500' : 'bg-blue-50/70 ring-1 ring-blue-400'
                        : isSelected
                        ? isDarkMode ? 'bg-slate-800' : 'bg-blue-50/60'
                        : index % 2 === 0
                        ? isDarkMode ? 'bg-slate-900' : 'bg-white'
                        : isDarkMode ? 'bg-slate-850' : 'bg-slate-50/50'
                    } ${!isInlineEditing && (isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-100/70')}`}
                  >
                    
                    {/* Checkbox & Direct Instant Delete */}
                    <td className={`${cellPad} text-center border-r border-slate-200 dark:border-slate-800/80 whitespace-nowrap`}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onToggleSelect(record.id)}
                          className="p-1 rounded cursor-pointer transition-transform active:scale-90"
                          title={isSelected ? "คลิกเพื่อยกเลิกเลือก" : "คลิกติ๊กถูกเลือกช่องนี้"}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <Square className={`w-4 h-4 ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`} />
                          )}
                        </button>

                        {/* Direct 1-Click Delete Button in this row when checked */}
                        {isSelected && !isInlineEditing && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteRecord(record);
                            }}
                            title="คลิกเพื่อลบบรรทัดนี้ทันที"
                            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-[10px] font-medium shadow-xs transition-all active:scale-90 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>ลบ</span>
                          </button>
                        )}
                      </div>
                    </td>

                    {activeViewMode === 'summary' ? (
                      <>
                        {/* 1. ลำดับ */}
                        <td className={`${cellPad} text-center font-mono border-r border-slate-200 dark:border-slate-800/80 text-slate-500 text-xs`}>
                          {record.orderNo || index + 1}
                        </td>

                        {/* 2. หมวดการกันตำแหน่ง */}
                        <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80`}>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border shadow-2xs ${
                            catConfig ? `${catConfig.pillBg} ${catConfig.pillText} ${catConfig.pillBorder}` : 'bg-slate-100 text-slate-900 border-slate-300'
                          }`}>
                            <span className={record.category === 'ยุบเลิก มติ ก.ตร.' ? 'underline decoration-[#15803d] decoration-[2px] underline-offset-4' : ''}>
                              {record.category}
                            </span>
                          </span>
                        </td>

                        {/* 3. POS CODE */}
                        <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80 whitespace-nowrap`}>
                          <span className={`inline-block font-mono font-bold text-xs tracking-wider px-2 py-0.5 rounded-md border shadow-2xs ${
                            isDarkMode
                              ? 'bg-blue-950/80 text-blue-300 border-blue-700/60'
                              : 'bg-blue-50 text-blue-900 border-blue-200'
                          }`}>
                            {record.positionNumber || '(ไม่มีเลข)'}
                          </span>
                        </td>

                        {/* 4. ระดับ / ตำแหน่ง / สังกัด */}
                        <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80`}>
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${
                                isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'
                              }`}>
                                {record.positionRank || '-'}
                              </span>
                              <span 
                                onClick={() => onViewDetail(record)}
                                className="font-medium text-xs truncate max-w-[210px] cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                                title="คลิกดูรายละเอียด"
                              >
                                {record.positionName}
                              </span>
                            </div>
                            {record.division && (
                              <span className="text-[10.5px] text-slate-400">
                                {record.division}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 5. บช. / สายงาน */}
                        <td className={`${cellPad} text-center border-r border-slate-200 dark:border-slate-800/80 whitespace-nowrap`}>
                          <div className="flex items-center justify-center gap-1">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-bold bg-blue-600 text-white shadow-2xs">
                              {record.bureau || '-'}
                            </span>
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${getDutyBadgeClasses(record.duty)}`}>
                              {record.duty}
                            </span>
                          </div>
                        </td>

                        {/* 6. ยศ - ชื่อ - สกุล / เลขบัตร ปชช. */}
                        <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80`}>
                          <div className="flex flex-col gap-0.5">
                            {record.personRankName ? (
                              <span className="font-semibold text-xs flex items-center gap-1 text-slate-900 dark:text-slate-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                <span>{record.personRankName}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10.5px] font-medium bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 w-fit">
                                ตำแหน่งว่าง
                              </span>
                            )}
                            {record.idCard && (
                              <span className="font-mono text-[10px] text-slate-400">
                                {isIdMasked ? formatCitizenId(record.idCard) : record.idCard}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 7. คำสั่งบรรจุ / มีผล / มติ */}
                        <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80`}>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs truncate max-w-[150px] font-medium" title={record.appointmentOrder}>
                              {record.appointmentOrder || '-'}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              {record.appointmentEffectiveDate && <span>มีผล: {record.appointmentEffectiveDate}</span>}
                              {record.resolutionNo && <span className="text-purple-500 dark:text-purple-400 font-semibold">• {record.resolutionNo}</span>}
                            </div>
                          </div>
                        </td>

                        {/* 8. สถานะ */}
                        <td className={`${cellPad} text-center border-r border-slate-200 dark:border-slate-800/80 whitespace-nowrap`}>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold border shadow-2xs ${
                              isDarkMode ? status.darkColor : status.lightColor
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.badge}
                          </span>
                        </td>

                        {/* 9. จัดการ */}
                        <td className={`${cellPad} text-center whitespace-nowrap`}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setViewMode('all');
                                startInlineEdit(record);
                              }}
                              title="แก้ไขข้อมูลในตาราง"
                              className="p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onEditRecord(record)}
                              title="เปิดแบบฟอร์มแก้ไขเต็ม"
                              className="px-1.5 py-0.5 rounded text-[10px] font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              ฟอร์ม
                            </button>
                            <button
                              onClick={() => onViewDetail(record)}
                              title="ดูรายละเอียดเชิงเปรียบเทียบ"
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDuplicateRecord(record)}
                              title="คัดลอกรายการนี้"
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteRecord(record)}
                              title="ลบรายการนี้"
                              className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>

                    {/* 1. ลำดับ (Order No) - EDITABLE */}
                    <td className={`${cellPad} text-center font-mono border-r border-slate-200 dark:border-slate-800/80 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {isInlineEditing ? (
                        <input
                          type="number"
                          value={inlineFormData.orderNo ?? ''}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              orderNo: parseInt(e.target.value, 10) || 1,
                            })
                          }
                          className={`${inputClass} w-16 text-center font-mono`}
                        />
                      ) : (
                        record.orderNo || index + 1
                      )}
                    </td>

                    {/* 2. ผ. เลขที่ / วันเดือนปี - EDITABLE */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80 font-medium`}>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={inlineFormData.reservationNoDate ?? ''}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              reservationNoDate: e.target.value,
                            })
                          }
                          placeholder="เช่น ผ.38/2567 ลง 24 ก.ย.2567"
                          className={`${inputClass} min-w-[160px]`}
                        />
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="truncate max-w-[200px]" title={record.reservationNoDate}>
                            {record.reservationNoDate || '-'}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* 3. หน่วยต้นเรื่อง - EDITABLE */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={inlineFormData.docOriginUnit ?? ''}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              docOriginUnit: e.target.value,
                            })
                          }
                          placeholder="เช่น วน., ภ.จว.ขอนแก่น"
                          className={`${inputClass} min-w-[115px]`}
                        />
                      ) : (
                        record.docOriginUnit || '-'
                      )}
                    </td>

                    {/* 4. ที่หนังสือต้นเรื่อง (ที่...) - EDITABLE */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80 font-mono text-xs ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={inlineFormData.docBookNumber ?? ''}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              docBookNumber: e.target.value,
                            })
                          }
                          placeholder="เช่น 0006.2/79"
                          className={`${inputClass} min-w-[115px] font-mono`}
                        />
                      ) : (
                        record.docBookNumber || '-'
                      )}
                    </td>

                    {/* 5. ลงวันที่ - EDITABLE */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80 text-xs whitespace-nowrap ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={inlineFormData.docDate ?? ''}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              docDate: e.target.value,
                            })
                          }
                          placeholder="เช่น 26-ส.ค.-67"
                          className={`${inputClass} min-w-[100px]`}
                        />
                      ) : (
                        record.docDate || '-'
                      )}
                    </td>

                    {/* 6. หมวดการกัน (13 หมวด) - EXACT COLORS FROM Capture.PNG */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80`}>
                      {isInlineEditing ? (
                        <select
                          value={inlineFormData.category}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              category: e.target.value as PoliceCategory,
                            })
                          }
                          className={`${inputClass} min-w-[140px] font-medium`}
                        >
                          {POLICE_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border shadow-xs ${
                          catConfig ? `${catConfig.pillBg} ${catConfig.pillText} ${catConfig.pillBorder}` : 'bg-slate-100 text-slate-900 border-slate-300'
                        }`}>
                          <span className={record.category === 'ยุบเลิก มติ ก.ตร.' ? 'underline decoration-[#15803d] decoration-[2px] underline-offset-4' : ''}>
                            {record.category}
                          </span>
                        </span>
                      )}
                    </td>

                    {/* 7. รหัสตำแหน่ง (POS CODE) - EDITABLE with auto-masking format */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80 whitespace-nowrap`}>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={inlineFormData.positionNumber ?? ''}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              positionNumber: formatPositionNumber(e.target.value),
                            })
                          }
                          placeholder="1205 12502 1216"
                          className={`${inputClass} min-w-[160px] font-mono font-bold tracking-wider text-blue-600 dark:text-blue-400`}
                        />
                      ) : (
                        <span className={`inline-block font-mono font-bold text-xs tracking-wider px-2.5 py-0.5 rounded-md border shadow-xs ${
                          isDarkMode
                            ? 'bg-blue-950/80 text-blue-300 border-blue-700/60'
                            : 'bg-blue-50 text-blue-900 border-blue-200'
                        }`}>
                          {record.positionNumber || '(ไม่มีเลข)'}
                        </span>
                      )}
                    </td>

                    {/* 8. ระดับ - EDITABLE */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80 font-semibold whitespace-nowrap`}>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          list="inline-ranks"
                          value={inlineFormData.positionRank ?? ''}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              positionRank: e.target.value,
                            })
                          }
                          placeholder="เช่น ผบ.หมู่"
                          className={`${inputClass} min-w-[90px]`}
                        />
                      ) : (
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${
                          isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'
                        }`}>
                          {record.positionRank || '-'}
                        </span>
                      )}
                    </td>

                    {/* 9. ตำแหน่ง/สังกัด/หน่วยงาน - EDITABLE */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80`}>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={inlineFormData.positionName ?? ''}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              positionName: e.target.value,
                            })
                          }
                          placeholder="เช่น สภ.เมืองฉะเชิงเทรา จว.ฉะเชิงเทรา"
                          className={`${inputClass} min-w-[230px]`}
                        />
                      ) : (
                        <span 
                          onClick={() => onViewDetail(record)}
                          className="truncate max-w-[280px] block cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:underline font-medium" 
                          title="คลิกเพื่อดูรายละเอียดเชิงเปรียบเทียบ"
                        >
                          {record.positionName || '-'}
                        </span>
                      )}
                    </td>

                    {/* 10. บก./ภ.จว. - EDITABLE */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80 whitespace-nowrap ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={inlineFormData.division ?? ''}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              division: e.target.value,
                            })
                          }
                          placeholder="เช่น ภ.จว.ฉะเชิงเทรา"
                          className={`${inputClass} min-w-[115px]`}
                        />
                      ) : (
                        record.division || '-'
                      )}
                    </td>

                    {/* 11. บช./ภ. - EDITABLE */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80 text-center whitespace-nowrap`}>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          list="inline-bureaus"
                          value={inlineFormData.bureau ?? ''}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              bureau: e.target.value,
                            })
                          }
                          placeholder="เช่น ภ.2"
                          className={`${inputClass} min-w-[75px] text-center font-bold`}
                        />
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-600 text-white shadow-xs">
                          {record.bureau || '-'}
                        </span>
                      )}
                    </td>

                    {/* 12. ทำหน้าที่ / สายงาน - EDITABLE */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80 leading-snug ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {isInlineEditing ? (
                        <div className="flex flex-col gap-1 min-w-[135px]">
                          <input
                            type="text"
                            value={inlineFormData.duty ?? ''}
                            onChange={(e) =>
                              setInlineFormData({
                                ...inlineFormData,
                                duty: e.target.value,
                              })
                            }
                            placeholder="ทำหน้าที่ เช่น สืบสวน"
                            className={inputClass}
                          />
                          <input
                            type="text"
                            value={inlineFormData.lineOfWork ?? ''}
                            onChange={(e) =>
                              setInlineFormData({
                                ...inlineFormData,
                                lineOfWork: e.target.value,
                              })
                            }
                            placeholder="สายงาน เช่น สส.สอบสวน"
                            className={`${inputClass} text-[11px]`}
                          />
                        </div>
                      ) : (
                        <div>
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border shadow-2xs ${
                            record.duty?.includes('สส') || record.duty?.includes('สืบสวน')
                              ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                              : record.duty?.includes('จร') || record.duty?.includes('จราจร')
                              ? 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                              : record.duty?.includes('อก') || record.duty?.includes('อำนวย') || record.duty?.includes('ธุรการ')
                              ? 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          }`}>
                            {record.duty || '-'}
                          </span>
                          {record.lineOfWork && record.lineOfWork !== record.duty && (
                            <div className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{record.lineOfWork}</div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* 13. ยศ - ชื่อ - สกุล - EDITABLE */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80`}>
                      {isInlineEditing ? (
                        <div className="flex flex-col gap-1 min-w-[185px]">
                          <input
                            type="text"
                            value={inlineFormData.personRankName ?? ''}
                            onChange={(e) =>
                              setInlineFormData({
                                ...inlineFormData,
                                personRankName: e.target.value,
                              })
                            }
                            placeholder="ยศ - ชื่อ - สกุล"
                            className={`${inputClass} font-semibold`}
                          />
                          <div className="flex items-center gap-1 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setInlineFormData((prev) => ({ ...prev, personRankName: '' }))}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600/50 cursor-pointer"
                            >
                              ตั้งเป็นอัตราว่าง
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="font-semibold flex items-center gap-1.5">
                          {record.personRankName ? (
                            <span className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span>{record.personRankName}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50">
                              ⚠️ (อัตราว่าง/รอจัดสรร)
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* 14. เลขประจำตัวประชาชน - EDITABLE */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80 whitespace-nowrap`}>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={inlineFormData.idCard ?? ''}
                          maxLength={13}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              idCard: e.target.value.replace(/[^\d]/g, '').slice(0, 13),
                            })
                          }
                          placeholder="เลข 13 หลัก"
                          className={`${inputClass} min-w-[135px] font-mono`}
                        />
                      ) : (
                        record.idCard ? (
                          <span className={`font-mono text-xs px-2 py-0.5 rounded border ${
                            isDarkMode 
                              ? 'bg-slate-900/80 text-emerald-300 border-slate-700' 
                              : 'bg-emerald-50/60 text-emerald-900 border-emerald-200'
                          }`}>
                            {formatCitizenId(record.idCard, isIdMasked)}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )
                      )}
                    </td>

                    {/* 15. คำสั่งบรรจุ / ที่ - EDITABLE */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80`}>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={inlineFormData.appointmentOrder ?? ''}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              appointmentOrder: e.target.value,
                            })
                          }
                          placeholder="เช่น ภ.จว.แพร่ ที่ 377/2568"
                          className={`${inputClass} min-w-[185px]`}
                        />
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                          <span className="truncate max-w-[200px] text-purple-950 dark:text-purple-200 font-medium" title={record.appointmentOrder}>
                            {record.appointmentOrder || '-'}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* 16. มีผลวันที่ - EDITABLE */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80 text-xs whitespace-nowrap ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={inlineFormData.appointmentEffectiveDate ?? ''}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              appointmentEffectiveDate: e.target.value,
                            })
                          }
                          placeholder="เช่น 31-ก.ค.-69"
                          className={`${inputClass} min-w-[100px]`}
                        />
                      ) : (
                        record.appointmentEffectiveDate || '-'
                      )}
                    </td>

                    {/* 17. มติ ก.ตร. / ตัดโอน - EDITABLE */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80 text-xs`}>
                      {isInlineEditing ? (
                        <div className="flex flex-col gap-1 min-w-[155px]">
                          <input
                            type="text"
                            value={inlineFormData.resolutionNo ?? ''}
                            onChange={(e) =>
                              setInlineFormData({
                                ...inlineFormData,
                                resolutionNo: e.target.value,
                              })
                            }
                            placeholder="มติ ก.ตร. ครั้งที่..."
                            className={inputClass}
                          />
                          <input
                            type="text"
                            value={inlineFormData.transferredRankOrPosition ?? ''}
                            onChange={(e) =>
                              setInlineFormData({
                                ...inlineFormData,
                                transferredRankOrPosition: e.target.value,
                              })
                            }
                            placeholder="ระดับ/ตัดโอน"
                            className={`${inputClass} text-[11px]`}
                          />
                        </div>
                      ) : (
                        record.resolutionNo || record.transferredRankOrPosition ? (
                          <div className="truncate max-w-[180px]" title={`${record.resolutionNo} ${record.transferredRankOrPosition}`}>
                            {record.resolutionNo && <div>{record.resolutionNo}</div>}
                            {record.transferredRankOrPosition && (
                              <div className="text-blue-600 dark:text-blue-400 font-medium">{record.transferredRankOrPosition}</div>
                            )}
                          </div>
                        ) : (
                          '-'
                        )
                      )}
                    </td>

                    {/* 18. สถานะสากล (Badge) / หมายเหตุ - EDITABLE */}
                    <td className={`${cellPad} border-r border-slate-200 dark:border-slate-800/80`}>
                      {isInlineEditing ? (
                        <div className="flex flex-col gap-1.5 min-w-[175px]">
                          {/* Live Badge Preview */}
                          {(() => {
                            const previewBadge = getStatusBadge(inlineFormData);
                            return (
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${
                                    isDarkMode ? previewBadge.darkColor : previewBadge.lightColor
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${previewBadge.dot}`} />
                                  {previewBadge.badge}
                                </span>
                                <span className="text-[10px] text-slate-400">Badge สด</span>
                              </div>
                            );
                          })()}

                          {/* Quick Badge Selector Dropdown */}
                          <select
                            value={(() => {
                              const val = inlineFormData.statusBadge || getStatusBadge(inlineFormData).badge;
                              const standardOptions = [
                                'บรรจุแล้ว',
                                'รอดำเนินการ',
                                'ไล่ออก',
                                'รอสั่งให้ออกฯ',
                                'ลาออกจากราชการ',
                                'ตำแหน่งว่าง',
                                'กันตำแหน่งแล้ว',
                                'สั่งพักราชการ',
                                'ตัดโอนแล้ว',
                                'ปฏิบัติราชการ',
                              ];
                              if (standardOptions.includes(val)) return val;
                              return 'CUSTOM';
                            })()}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'CUSTOM') {
                                setInlineFormData((prev) => ({
                                  ...prev,
                                  statusBadge: prev.statusBadge || getStatusBadge(prev).badge,
                                }));
                              } else {
                                setInlineFormData((prev) => ({
                                  ...prev,
                                  statusBadge: val,
                                }));
                              }
                            }}
                            className={`${inputClass} text-[11px] font-semibold cursor-pointer`}
                            title="เลือกสถานะสากลตามมาตรฐาน ตร."
                          >
                            <option value="บรรจุแล้ว">🟢 บรรจุแล้ว (RESERVED)</option>
                            <option value="รอดำเนินการ">🟡 รอดำเนินการ (IN_PROGRESS)</option>
                            <option value="ไล่ออก">🔴 ไล่ออก (DISMISS)</option>
                            <option value="รอสั่งให้ออกฯ">🟠 รอสั่งให้ออกฯ</option>
                            <option value="ลาออกจากราชการ">🟣 ลาออกจากราชการ</option>
                            <option value="ตำแหน่งว่าง">🔵 ตำแหน่งว่าง (VACANT)</option>
                            <option value="กันตำแหน่งแล้ว">⚪ กันตำแหน่งแล้ว (HELD)</option>
                            <option value="สั่งพักราชการ">🟤 สั่งพักราชการ</option>
                            <option value="ตัดโอนแล้ว">🔷 ตัดโอนแล้ว</option>
                            <option value="ปฏิบัติราชการ">🟢 ปฏิบัติราชการ</option>
                            <option value="CUSTOM">✏️ กำหนดเอง...</option>
                          </select>

                          {/* Editable Custom Badge Text Input */}
                          <input
                            type="text"
                            value={inlineFormData.statusBadge ?? ''}
                            onChange={(e) =>
                              setInlineFormData({
                                ...inlineFormData,
                                statusBadge: e.target.value,
                              })
                            }
                            placeholder={`ระบุ Badge (เช่น ${getStatusBadge(inlineFormData).badge})`}
                            className={`${inputClass} text-[11px] font-semibold text-amber-300`}
                            title="แก้ไขข้อความสถานะสากล (Badge) ได้ทุกคำสั่ง"
                          />

                          {/* Custom Notes */}
                          <input
                            type="text"
                            value={inlineFormData.notes ?? ''}
                            onChange={(e) =>
                              setInlineFormData({
                                ...inlineFormData,
                                notes: e.target.value,
                              })
                            }
                            placeholder="หมายเหตุ เช่น (ลับ), ไล่ออก"
                            className={`${inputClass} text-[11px]`}
                          />

                          {/* Quick Secret Toggle */}
                          <div className="flex items-center gap-1 text-[10px]">
                            <button
                              type="button"
                              onClick={() =>
                                setInlineFormData((prev) => ({
                                  ...prev,
                                  notes: prev.notes?.includes('(ลับ)')
                                    ? prev.notes.replace('(ลับ)', '').trim()
                                    : `${prev.notes || ''} (ลับ)`.trim(),
                                }))
                              }
                              className={`px-1.5 py-0.5 rounded cursor-pointer border ${
                                inlineFormData.notes?.includes('(ลับ)')
                                  ? 'bg-purple-600 text-white border-purple-400 font-bold'
                                  : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-700/50'
                              }`}
                            >
                              🔒 {inlineFormData.notes?.includes('(ลับ)') ? 'เอกสารลับ (คลิกเพื่อปลด)' : '+ลับ'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border shadow-xs ${
                              isDarkMode ? status.darkColor : status.lightColor
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.badge}
                          </span>

                          {isSecret && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/40">
                              <Lock className="w-2.5 h-2.5" />
                              ลับ
                            </span>
                          )}

                          {record.notes && !isSecret && record.notes !== status.text && (
                            <span className={`text-[11px] truncate max-w-[110px] block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} title={record.notes}>
                              {record.notes}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* เครื่องมือ Actions */}
                    <td className={`${cellPad} text-center whitespace-nowrap ${isDarkMode ? 'bg-slate-900/30' : 'bg-slate-50/50'}`}>
                      {isInlineEditing ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => saveInlineEdit(record.id)}
                            title="บันทึกการแก้ไขทุกช่องทันที"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-xs cursor-pointer transition-transform active:scale-95"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>บันทึก</span>
                          </button>
                          <button
                            onClick={cancelInlineEdit}
                            title="ยกเลิกการแก้ไข"
                            className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          {/* Quick inline edit of ALL columns */}
                          <button
                            onClick={() => startInlineEdit(record)}
                            title="แก้ไขข้อมูลทุกช่องในแถวนี้ (Inline Edit: 18 รายการ)"
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all shadow-xs cursor-pointer ${
                              isDarkMode 
                                ? 'bg-blue-950/60 hover:bg-blue-900 text-blue-200 border border-blue-700/60' 
                                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                            }`}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>แก้ไขทุกช่อง</span>
                          </button>

                          {/* Full Form Modal */}
                          <button
                            onClick={() => onEditRecord(record)}
                            title="เปิดแบบฟอร์มแก้ไขสารบรรณฉบับเต็ม (Modal: 18 รายการ)"
                            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer border ${
                              isDarkMode 
                                ? 'hover:bg-slate-800 text-slate-300 border-slate-700' 
                                : 'hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            ฟอร์ม
                          </button>

                          {/* Detail Modal View */}
                          <button
                            onClick={() => onViewDetail(record)}
                            title="ดูรายละเอียดการเปรียบเทียบเชิงลึก (Detail Modal)"
                            className={`p-1.5 rounded-md transition-colors cursor-pointer border border-transparent ${
                              isDarkMode 
                                ? 'hover:bg-slate-800 text-slate-300 hover:text-white' 
                                : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={() => onDuplicateRecord(record)}
                            title="คัดลอกรายการนี้เพื่อสร้างตำแหน่งใหม่"
                            className={`p-1.5 rounded-md transition-colors cursor-pointer border border-transparent ${
                              isDarkMode 
                                ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' 
                                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteRecord(record)}
                            title="ลบรายการนี้ทันที"
                            className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-600 text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                    </>
                    )}

                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination Footer */}
      <div className={`px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t transition-colors ${
        isDarkMode ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        
        {/* Left: Rows per page */}
        <div className="flex items-center gap-2">
          <span>แสดงแถว:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className={`border rounded px-2 py-1 outline-none font-['Sarabun'] ${
              isDarkMode ? 'bg-[#1e293b] border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
            }`}
          >
            <option value={25}>25 รายการ</option>
            <option value={50}>50 รายการ</option>
            <option value={100}>100 รายการ</option>
            <option value={500}>500 รายการ</option>
          </select>
          <span>
            (หน้า {currentPage} จาก {totalPages} หน้า | ทั้งหมด {sortedRecords.length} รายการ)
          </span>
        </div>

        {/* Right: Page Navigation Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-2.5 py-1 rounded border disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              isDarkMode 
                ? 'bg-[#1e293b] border-slate-700 hover:bg-slate-700 text-slate-200' 
                : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            « หน้าแรก
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-2.5 py-1 rounded border disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              isDarkMode 
                ? 'bg-[#1e293b] border-slate-700 hover:bg-slate-700 text-slate-200' 
                : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            ‹ ก่อนหน้า
          </button>

          <span className={`px-3 py-1 rounded font-semibold border ${
            isDarkMode 
              ? 'bg-blue-600 text-white border-blue-500' 
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            {currentPage}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-2.5 py-1 rounded border disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              isDarkMode 
                ? 'bg-[#1e293b] border-slate-700 hover:bg-slate-700 text-slate-200' 
                : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            ถัดไป ›
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-2.5 py-1 rounded border disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              isDarkMode 
                ? 'bg-[#1e293b] border-slate-700 hover:bg-slate-700 text-slate-200' 
                : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            สุดท้าย »
          </button>
        </div>

      </div>

    </div>
  );
};
