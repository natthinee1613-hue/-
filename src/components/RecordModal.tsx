import React, { useState, useEffect } from 'react';
import { PoliceCategory, PolicePositionRecord, POLICE_CATEGORIES } from '../types/police';
import { formatPositionNumber, CATEGORY_CONFIG, getStatusBadge } from '../utils/formatters';
import { 
  X, 
  Save, 
  FileText, 
  Layers, 
  User, 
  FileCheck, 
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Clock,
  UserX,
  AlertTriangle,
  Lock
} from 'lucide-react';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: PolicePositionRecord) => void;
  initialRecord: PolicePositionRecord | null;
  defaultCategory: PoliceCategory;
  officerName: string;
  isDarkMode?: boolean;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRecord,
  defaultCategory,
  officerName,
  isDarkMode = false,
}) => {
  const isEditing = Boolean(initialRecord);

  const [formData, setFormData] = useState<PolicePositionRecord>({
    id: '',
    category: defaultCategory,
    orderNo: 1,
    reservationNoDate: '',
    docOriginUnit: '',
    docBookNumber: '',
    docDate: '',
    positionNumber: '',
    positionRank: 'ผบ.หมู่',
    positionName: '',
    division: '',
    bureau: 'ภ.1',
    duty: 'ปฏิบัติงานป้องกันปราบปราม',
    lineOfWork: 'ป้องกันปราบปรามอาชญากรรม',
    workGroup: 'ป้องกันปราบปราม',
    personRankName: '',
    idCard: '',
    requestSource: '',
    appointmentOrder: '',
    appointmentEffectiveDate: '',
    resolutionNo: '',
    transferredRankOrPosition: '',
    notes: '',
    statusBadge: '',
    updatedAt: '',
    updatedBy: officerName,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<'all' | '1' | '2' | '3' | '4'>('all');

  useEffect(() => {
    if (initialRecord) {
      setFormData({
        ...initialRecord,
        statusBadge: initialRecord.statusBadge || '',
        updatedBy: officerName,
      });
    } else {
      setFormData({
        id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        category: defaultCategory,
        orderNo: 1,
        reservationNoDate: 'ผ. .../2569 ลง ...',
        docOriginUnit: 'วน.',
        docBookNumber: '0006.2/...',
        docDate: '',
        positionNumber: '',
        positionRank: 'ผบ.หมู่',
        positionName: '',
        division: '',
        bureau: 'ภ.1',
        duty: 'ปฏิบัติงานป้องกันปราบปราม',
        lineOfWork: 'ป้องกันปราบปรามอาชญากรรม',
        workGroup: 'ป้องกันปราบปราม',
        personRankName: '',
        idCard: '',
        requestSource: '',
        appointmentOrder: '',
        appointmentEffectiveDate: '',
        resolutionNo: '',
        transferredRankOrPosition: '',
        notes: '',
        statusBadge: '',
        updatedAt: new Date().toISOString(),
        updatedBy: officerName,
      });
    }
    setErrors({});
  }, [initialRecord, defaultCategory, isOpen, officerName]);

  if (!isOpen) return null;

  // Masking input for position number: 1205 12502 1216
  const handlePositionNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatPositionNumber(raw);
    setFormData((prev) => ({ ...prev, positionNumber: formatted }));
  };

  // Masking citizen ID to 13 digits clean
  const handleIdCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '').slice(0, 13);
    setFormData((prev) => ({ ...prev, idCard: raw }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.category) {
      newErrors.category = 'กรุณาเลือกหมวดการกันตำแหน่ง';
    }
    if (!formData.positionNumber && !formData.positionName) {
      newErrors.positionNumber = 'กรุณาระบุเลขตำแหน่งหรือสังกัด';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      updatedAt: new Date().toISOString(),
      updatedBy: officerName,
    });
    onClose();
  };

  const modalInputClass = isDarkMode
    ? 'w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500'
    : 'w-full bg-white border border-slate-300 text-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 shadow-2xs';

  const modalSectionClass = isDarkMode
    ? 'bg-slate-900/60 p-4 rounded-xl border border-slate-700/80'
    : 'bg-slate-50/80 p-4 rounded-xl border border-slate-200';

  const labelClass = `block text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className={`relative w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden my-8 border transition-colors animate-in fade-in zoom-in-95 duration-200 ${
        isDarkMode 
          ? 'bg-[#1e293b] border-slate-700 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between transition-colors ${
          isDarkMode 
            ? 'bg-[#0f172a] border-slate-700 text-slate-100' 
            : 'bg-[#0f243c] border-blue-900/60 text-white'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-600/40">
                  {isEditing ? 'แก้ไขข้อมูลสารบรรณ' : 'บันทึกรายการกันตำแหน่งใหม่'}
                </span>
                <span className="text-xs text-blue-200/80">แบบฟอร์ม ตร.</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {isEditing
                  ? `แก้ไขรายการ: ${formData.positionNumber || formData.positionName || 'ไม่ระบุ'}`
                  : 'เพิ่มข้อมูลการกันตำแหน่งข้าราชการตำรวจชั้นประทวน (งานประทวน 1)'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Quick Jump Filter */}
        <div className={`border-b px-6 py-2.5 flex flex-wrap items-center gap-2 text-xs transition-colors ${
          isDarkMode ? 'bg-[#0f172a]/70 border-slate-700/80' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>กระโดดไปส่วน:</span>
          <button
            type="button"
            onClick={() => setActiveSection('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeSection === 'all'
                ? 'bg-blue-600 text-white font-medium shadow-xs'
                : isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            แสดงทั้งหมด 4 ส่วน
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('1')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeSection === '1'
                ? 'bg-blue-600 text-white font-medium shadow-xs'
                : isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            1. สารบรรณ
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('2')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeSection === '2'
                ? 'bg-blue-600 text-white font-medium shadow-xs'
                : isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            2. กรอบตำแหน่ง
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('3')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeSection === '3'
                ? 'bg-blue-600 text-white font-medium shadow-xs'
                : isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            3. กำลังพล
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('4')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeSection === '4'
                ? 'bg-blue-600 text-white font-medium shadow-xs'
                : isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            4. คำสั่ง/มติ
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Global Category Selector */}
          <div className={`p-4 rounded-xl border transition-colors ${
            isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              หมวดการกันตำแหน่ง (1 ใน 13 หมวดตามโครงสร้าง ตร.) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {POLICE_CATEGORIES.map((cat) => {
                const config = CATEGORY_CONFIG[cat];
                const isSelected = formData.category === cat;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`px-2.5 py-2 rounded-lg text-xs font-bold text-left border transition-all truncate cursor-pointer ${
                      config.pillBg
                    } ${config.pillText} ${config.pillBorder} ${
                      isSelected
                        ? 'ring-2 ring-slate-900 dark:ring-white scale-[1.02] shadow-md'
                        : 'opacity-85 hover:opacity-100 hover:shadow-xs'
                    }`}
                  >
                    <span className={cat === 'ยุบเลิก มติ ก.ตร.' ? 'underline decoration-[#15803d] decoration-[2px] underline-offset-4' : ''}>
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.category}
              </p>
            )}
          </div>

          {/* Section 1: ข้อมูลทางสารบรรณ */}
          {(activeSection === 'all' || activeSection === '1') && (
            <div className="bg-slate-950/40 p-4 rounded-xl border border-amber-900/30">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-400 dark:text-amber-300 mb-3 pb-2 border-b border-amber-900/30 font-['Sarabun']">
                <FileText className="w-4 h-4 text-amber-400 dark:text-amber-300" />
                <span className="text-amber-400 dark:text-amber-300">1. ข้อมูลทางสารบรรณ (Saraban Info)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    ลำดับที่ (ในบัญชี)
                  </label>
                  <input
                    type="number"
                    value={formData.orderNo || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, orderNo: parseInt(e.target.value, 10) || 1 })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    เลขที่ ผ. / วันเดือนปีที่กันตำแหน่ง
                  </label>
                  <input
                    type="text"
                    value={formData.reservationNoDate}
                    onChange={(e) =>
                      setFormData({ ...formData, reservationNoDate: e.target.value })
                    }
                    placeholder="เช่น ผ.38/2567 ลง 24 ก.ย.2567(งาน ส.)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    หน่วยงานเจ้าของเรื่อง (บก./บช.)
                  </label>
                  <input
                    type="text"
                    value={formData.docOriginUnit}
                    onChange={(e) =>
                      setFormData({ ...formData, docOriginUnit: e.target.value })
                    }
                    placeholder="เช่น วน., ภ.จว.ขอนแก่น"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    เลขที่หนังสือต้นเรื่อง (ที่...)
                  </label>
                  <input
                    type="text"
                    value={formData.docBookNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, docBookNumber: e.target.value })
                    }
                    placeholder="เช่น 0006.2/79, 0019(ขก).417/6579"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    หนังสือลงวันที่ (ว/ด/ป)
                  </label>
                  <input
                    type="text"
                    value={formData.docDate}
                    onChange={(e) => setFormData({ ...formData, docDate: e.target.value })}
                    placeholder="เช่น 26-ส.ค.-67, 14-มี.ค.-68"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 2: ข้อมูลโครงสร้างตำแหน่ง */}
          {(activeSection === 'all' || activeSection === '2') && (
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-300 mb-3 pb-2 border-b border-slate-700/60">
                <Layers className="w-4 h-4 text-amber-300" />
                <span>2. ข้อมูลโครงสร้างตำแหน่ง (Position Info)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                
                {/* Position Number with Masking */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-red-500 dark:text-red-400 font-['Sarabun']">
                      เลขตำแหน่ง (รูปแบบ xxxx xxxxx xxxx) <span className="text-red-400">*</span>
                    </label>
                    <span className="text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/40">
                      Auto-Masking
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.positionNumber}
                    onChange={handlePositionNumberChange}
                    placeholder="เช่น 1205 12502 1216"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-amber-300 font-mono font-bold tracking-wider"
                  />
                  {errors.positionNumber && (
                    <p className="text-[11px] text-red-400 mt-1">{errors.positionNumber}</p>
                  )}
                </div>

                {/* Level / Rank */}
                <div>
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    ระดับตำแหน่ง
                  </label>
                  <input
                    type="text"
                    list="rank-suggestions"
                    value={formData.positionRank}
                    onChange={(e) => setFormData({ ...formData, positionRank: e.target.value })}
                    placeholder="เช่น ผบ.หมู่, ผบ.หมู่ (ป.), รอง สว., รอง สว.(สส.)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <datalist id="rank-suggestions">
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
                    <option value="ผกก." />
                  </datalist>
                </div>

                {/* Bureau */}
                <div>
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    กองบัญชาการ (บช.)
                  </label>
                  <input
                    type="text"
                    list="bureau-suggestions"
                    value={formData.bureau}
                    onChange={(e) => setFormData({ ...formData, bureau: e.target.value })}
                    placeholder="เช่น ภ.1, ภ.2, ภ.3, ภ.4, ภ.5, บช.สอท."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold"
                  />
                  <datalist id="bureau-suggestions">
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
                    <option value="บช.ตชด." />
                    <option value="วน." />
                    <option value="สง.ก.ตร." />
                    <option value="บ.ตร." />
                  </datalist>
                </div>

                {/* Position Name / Agency */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    ตำแหน่ง / สังกัด / หน่วยงาน
                  </label>
                  <input
                    type="text"
                    value={formData.positionName}
                    onChange={(e) => setFormData({ ...formData, positionName: e.target.value })}
                    placeholder="เช่น สภ.เมืองฉะเชิงเทรา จว.ฉะเชิงเทรา"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                {/* Division */}
                <div>
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    กองบังคับการ (บก.)
                  </label>
                  <input
                    type="text"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    placeholder="เช่น ภ.จว.ฉะเชิงเทรา, บก.สส.ภ.2"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                {/* Duty */}
                <div>
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    ทำหน้าที่
                  </label>
                  <input
                    type="text"
                    value={formData.duty}
                    onChange={(e) => setFormData({ ...formData, duty: e.target.value })}
                    placeholder="เช่น ปฏิบัติงานป้องกันปราบปราม, สืบสวน"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                {/* Line of Work */}
                <div>
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    สายงาน
                  </label>
                  <input
                    type="text"
                    value={formData.lineOfWork}
                    onChange={(e) => setFormData({ ...formData, lineOfWork: e.target.value })}
                    placeholder="เช่น ป้องกันปราบปรามอาชญากรรม, สืบสวน"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                {/* Work Group */}
                <div>
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    กลุ่มสายงาน
                  </label>
                  <input
                    type="text"
                    value={formData.workGroup}
                    onChange={(e) => setFormData({ ...formData, workGroup: e.target.value })}
                    placeholder="เช่น ป้องกันปราบปราม, สืบสวนสอบสวน, อำนวยการและสนับสนุน"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

              </div>
            </div>
          )}

          {/* Section 3: ข้อมูลบุคคล / ผู้ครอง */}
          {(activeSection === 'all' || activeSection === '3') && (
            <div className="bg-slate-950/40 p-4 rounded-xl border border-amber-900/30">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-400 dark:text-amber-300 mb-3 pb-2 border-b border-amber-900/30 font-['Sarabun']">
                <User className="w-4 h-4 text-amber-400 dark:text-amber-300" />
                <span className="text-amber-400 dark:text-amber-300">3. ข้อมูลบุคคล (Personnel Info)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    ยศ - ชื่อ - สกุล (ผู้ครองหรือผู้ขอรับสิทธิ์)
                  </label>
                  <input
                    type="text"
                    value={formData.personRankName}
                    onChange={(e) =>
                      setFormData({ ...formData, personRankName: e.target.value })
                    }
                    placeholder="เช่น ส.ต.อ.อภิสิทธิ์ คนยงค์ หรือว่างไว้"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    เลขประจำตัวประชาชน (13 หลัก)
                  </label>
                  <input
                    type="text"
                    value={formData.idCard}
                    onChange={handleIdCardChange}
                    maxLength={13}
                    placeholder="เช่น 3209600261566"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    ร้องขอจาก... (กรณีกลับเข้ารับราชการ/ทายาท)
                  </label>
                  <input
                    type="text"
                    value={formData.requestSource}
                    onChange={(e) =>
                      setFormData({ ...formData, requestSource: e.target.value })
                    }
                    placeholder="เช่น ก.พ.ค.ตร., คำสั่งศาลปกครอง"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 4: มติ/คำสั่งและการมีผล */}
          {(activeSection === 'all' || activeSection === '4') && (
            <div className="bg-slate-950/40 p-4 rounded-xl border border-amber-900/40">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-400 mb-3 pb-2 border-b border-amber-900/30">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span>4. มติ/คำสั่งและการมีผล (Order & Effect)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    คำสั่งบรรจุ / ที่
                  </label>
                  <input
                    type="text"
                    value={formData.appointmentOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, appointmentOrder: e.target.value })
                    }
                    placeholder="เช่น คำสั่ง ภ.จว.แพร่ ที่ 377/2568"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    คำสั่งบรรจุมีผลวันที่ (ว/ด/ป)
                  </label>
                  <input
                    type="text"
                    value={formData.appointmentEffectiveDate}
                    onChange={(e) =>
                      setFormData({ ...formData, appointmentEffectiveDate: e.target.value })
                    }
                    placeholder="เช่น 16-ก.ค.-69, 1-เม.ย.-68"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    มติ ก.ตร. / อ.ก.ตร. ครั้งที่... / เมื่อวันที่...
                  </label>
                  <input
                    type="text"
                    value={formData.resolutionNo}
                    onChange={(e) =>
                      setFormData({ ...formData, resolutionNo: e.target.value })
                    }
                    placeholder="เช่น มติ ก.ตร. ครั้งที่ 12/2567"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    ระดับที่ตัดโอน / เลขตำแหน่งรอง สว. ที่รองรับ
                  </label>
                  <input
                    type="text"
                    value={formData.transferredRankOrPosition}
                    onChange={(e) =>
                      setFormData({ ...formData, transferredRankOrPosition: e.target.value })
                    }
                    placeholder="เช่น ตัดโอนไปกำหนดเป็น รอง สว. ภ.จว.ปทุมธานี"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1 font-['Sarabun']">
                    หมายเหตุ / ข้อความเพิ่มเติม
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="เช่น (ลับ), ไล่ออก, เพื่อจะสั่งให้ออกฯ, บรรจุแล้ว"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                {/* ช่อง สถานะสากล (Badge) - แสดงผลตามมาตรฐาน ตร. (แก้ไขได้ทุกคำสั่ง) */}
                <div className="sm:col-span-3 bg-slate-900/95 border border-slate-700/90 p-4 rounded-xl mt-2 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800">
                    <div>
                      <label className="block text-xs font-semibold text-red-500 dark:text-red-400 font-['Sarabun'] mb-0.5">
                        สถานะสากล (Badge) - แสดงผลตามมาตรฐาน ตร.
                      </label>
                      <span className="text-[11px] text-slate-400">
                        สามารถแก้ไขหรือกำหนดสถานะสำหรับทุกคำสั่งได้อย่างอิสระ (ไม่ลบและไม่เปลี่ยนแปลงคำสั่งบรรจุเดิม)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">แสดงผลปัจจุบัน:</span>
                      {(() => {
                        const currentBadge = getStatusBadge(formData);
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${currentBadge.darkColor}`}>
                            <span className={`w-2 h-2 rounded-full ${currentBadge.dot}`} />
                            {currentBadge.badge}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Dropdown Selection & Direct Text Input */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        เลือกสถานะสากล (มาตรฐาน ตร.)
                      </label>
                      <select
                        value={(() => {
                          const val = formData.statusBadge || getStatusBadge(formData).badge;
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
                            setFormData((prev) => ({
                              ...prev,
                              statusBadge: prev.statusBadge || getStatusBadge(prev).badge,
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              statusBadge: val,
                            }));
                          }
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-medium focus:border-amber-400 focus:outline-none cursor-pointer"
                      >
                        <option value="บรรจุแล้ว">🟢 บรรจุแล้ว (RESERVED) - คำสั่งบรรจุเรียบร้อย</option>
                        <option value="รอดำเนินการ">🟡 รอดำเนินการ (IN_PROGRESS) - อยู่ระหว่างสงวน/พิจารณา</option>
                        <option value="ไล่ออก">🔴 ไล่ออก (DISMISSAL) - มีคำสั่งให้ออก/ไล่ออก</option>
                        <option value="รอสั่งให้ออกฯ">🟠 รอสั่งให้ออกฯ (PENDING_OUT) - เตรียมออกคำสั่ง</option>
                        <option value="ลาออกจากราชการ">🟣 ลาออกจากราชการ (RESIGNED)</option>
                        <option value="ตำแหน่งว่าง">🔵 ตำแหน่งว่าง (VACANT) - ไม่มีผู้ครอง</option>
                        <option value="กันตำแหน่งแล้ว">⚪ กันตำแหน่งแล้ว (HELD) - สงวนตำแหน่งตามระเบียบ</option>
                        <option value="สั่งพักราชการ">🟤 สั่งพักราชการ (SUSPENDED)</option>
                        <option value="ตัดโอนแล้ว">🔷 ตัดโอนแล้ว (TRANSFERRED) - กำหนดตัดโอนตำแหน่ง</option>
                        <option value="ปฏิบัติราชการ">🟢 ปฏิบัติราชการ (ACTIVE) - ปฏิบัติราชการปกติ</option>
                        <option value="CUSTOM">✏️ กำหนดเอง / ระบุข้อความเฉพาะ...</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        ข้อความสถานะสากล (แก้ไขได้ทุกคำสั่ง / พิมพ์อิสระ)
                      </label>
                      <input
                        type="text"
                        value={formData.statusBadge || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, statusBadge: e.target.value }))
                        }
                        placeholder={`เช่น ${getStatusBadge(formData).badge}`}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-semibold focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Preset Quick Buttons: Sets statusBadge directly WITHOUT overwriting/wiping out appointmentOrder */}
                  <div className="pt-2.5 border-t border-slate-800">
                    <span className="block text-[11px] text-slate-400 mb-2 font-medium">
                      ปุ่มลัดเลือกสถานะทันที (ปลอดภัย: ไม่ลบคำสั่งบรรจุที่มีอยู่):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            statusBadge: 'บรรจุแล้ว',
                          }))
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-500/50 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>🟢 บรรจุแล้ว</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            statusBadge: 'รอดำเนินการ',
                          }))
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-800/80 text-amber-200 border border-amber-500/50 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>🟡 รอดำเนินการ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            statusBadge: 'ไล่ออก',
                          }))
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/80 text-red-200 border border-red-500/50 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        <UserX className="w-3.5 h-3.5 text-red-400" />
                        <span>🔴 ไล่ออก</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            statusBadge: 'รอสั่งให้ออกฯ',
                          }))
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-900/40 hover:bg-orange-800/80 text-orange-200 border border-orange-500/50 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                        <span>🟠 รอสั่งให้ออกฯ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            statusBadge: 'ตำแหน่งว่าง',
                          }))
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/80 text-blue-200 border border-blue-500/50 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                        <span>🔵 ตำแหน่งว่าง</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            statusBadge: 'กันตำแหน่งแล้ว',
                          }))
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-900/40 hover:bg-teal-800/80 text-teal-200 border border-teal-500/50 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                        <span>⚪ กันตำแหน่งแล้ว</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            notes: prev.notes.includes('(ลับ)')
                              ? prev.notes.replace('(ลับ)', '').trim()
                              : `${prev.notes} (ลับ)`.trim(),
                          }))
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/80 text-purple-200 border border-purple-500/50 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5 text-purple-400" />
                        <span>🟣 สลับสถานะ (ลับ)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              บันทึกโดย: <strong className="text-slate-300">{officerName}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all shadow-lg shadow-emerald-900/30"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'บันทึกการแก้ไข' : 'บันทึกรายการ'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
