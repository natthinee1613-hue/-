import React from 'react';
import { PolicePositionRecord } from '../types/police';
import { 
  formatCitizenId, 
  getStatusBadge, 
  CATEGORY_CONFIG 
} from '../utils/formatters';
import { 
  X, 
  Shield, 
  ArrowRight, 
  FileText, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Edit3,
  BadgeAlert,
  Building,
  Calendar,
  Lock
} from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PolicePositionRecord | null;
  isIdMasked: boolean;
  onOpenEdit: (record: PolicePositionRecord) => void;
  isDarkMode: boolean;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  record,
  isIdMasked,
  onOpenEdit,
  isDarkMode,
}) => {
  if (!isOpen || !record) return null;

  const status = getStatusBadge(record);
  const catConfig = CATEGORY_CONFIG[record.category];
  const isSecret = record.notes.includes('ลับ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className={`relative w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden my-6 border transition-colors animate-in fade-in zoom-in-95 duration-200 ${
          isDarkMode 
            ? 'bg-[#1e293b] border-slate-700 text-slate-100' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        
        {/* Header with Royal Thai Police Identity */}
        <div className="bg-[#0f243c] px-6 py-4 border-b border-blue-900/60 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-medium">
                  รายละเอียดทำเนียบกำลังพลและการกันตำแหน่ง ข้าราชการตำรวจชั้นประทวน (งานประทวน 1)
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5 flex items-center gap-2 font-['Sarabun']">
                <span>หมวด: {record.category}</span>
                {isSecret && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200 border border-purple-500">
                    <Lock className="w-3 h-3" /> เอกสารลับ
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenEdit(record)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer font-['Sarabun']"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>แก้ไขรายการ</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 font-['Sarabun']">
          
          {/* Top Banner Status Bar */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDarkMode ? 'bg-[#0f172a] border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">เลขตำแหน่ง:</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-blue-700 dark:text-blue-400 tracking-wider mt-0.5">
                {record.positionNumber || '(ยังไม่ระบุเลขตำแหน่ง)'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                ระดับ {record.positionRank} • กองบัญชาการ {record.bureau} • กองบังคับการ {record.division}
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">สถานะการกันตำแหน่ง:</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-xs ${
                isDarkMode ? status.darkColor : status.lightColor
              }`}>
                <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                {status.text}
              </span>
            </div>
          </div>

          {/* Comparative Section: [ข้อมูลเดิม / ผู้ครอง] ⟷ [ข้อมูลตำแหน่งใหม่ที่กันไว้] */}
          <div>
            <div className="flex items-center justify-between mb-3 pb-1 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 font-['Sarabun']">
                <span>ตารางเปรียบเทียบข้อมูลกำลังพลและกรอบตำแหน่ง</span>
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                มาตรฐานสารบรรณและการบริหารกำลังพล ตร.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column: ข้อมูลเดิม / กำลังพลผู้ครองเดิม */}
              <div className={`p-4 rounded-xl border ${
                isDarkMode ? 'bg-[#0f172a] border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700 font-['Sarabun']">
                  <UserCheck className="w-4 h-4" />
                  <span>ข้อมูลเดิม / กำลังพลผู้ครองเดิม</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">ยศ - ชื่อ - สกุล ผู้ครองเดิม:</span>
                    <span className="font-semibold text-sm">
                      {record.personRankName ? (
                        record.personRankName
                      ) : (
                        <span className="text-slate-400 italic font-normal">(ตำแหน่งว่าง / ไม่มีผู้ครองเดิม)</span>
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">เลขประจำตัวประชาชน (13 หลัก):</span>
                    <span className="font-mono text-xs font-medium">
                      {record.idCard ? formatCitizenId(record.idCard, isIdMasked) : '-'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">หน่วยงาน / ที่มาต้นเรื่อง:</span>
                    <span className="font-medium">
                      {record.docOriginUnit || '-'} (สังกัด {record.division || '-'})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">ร้องขอ / มูลเหตุจาก:</span>
                    <span className="font-medium">
                      {record.requestSource || `ตามกรณี ${record.category}`}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">เลขที่หนังสือต้นเรื่อง:</span>
                    <span className="font-mono font-medium">
                      {record.docBookNumber || '-'} {record.docDate ? `(ลงวันที่ ${record.docDate})` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: ข้อมูลตำแหน่งใหม่ที่กันไว้ / การจัดสรร */}
              <div className={`p-4 rounded-xl border ${
                isDarkMode ? 'bg-[#0f172a] border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700 font-['Sarabun']">
                  <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>ข้อมูลตำแหน่งที่กันไว้ / แผนรองรับ</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">ตำแหน่ง / หน่วยงานที่สงวนไว้:</span>
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      {record.positionName || '-'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block mb-0.5">ระดับตำแหน่ง:</span>
                      <span className="font-semibold">{record.positionRank || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block mb-0.5">ทำหน้าที่:</span>
                      <span className="font-medium">{record.duty || '-'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block mb-0.5">สายงาน:</span>
                      <span className="font-medium">{record.lineOfWork || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block mb-0.5">กลุ่มสายงาน:</span>
                      <span className="font-medium">{record.workGroup || '-'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">คำสั่งบรรจุ / ผลบังคับใช้:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {record.appointmentOrder ? (
                        `${record.appointmentOrder} ${record.appointmentEffectiveDate ? `(มีผลวันที่ ${record.appointmentEffectiveDate})` : ''}`
                      ) : (
                        <span className="text-slate-400 font-normal">อยู่ระหว่างรอคำสั่งหรือผลสอบสวน</span>
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">มติ ก.ตร. / ตำแหน่งรองรับตัดโอน:</span>
                    <span className="font-medium text-blue-700 dark:text-blue-400">
                      {record.resolutionNo || record.transferredRankOrPosition ? (
                        `${record.resolutionNo || ''} ${record.transferredRankOrPosition || ''}`
                      ) : (
                        '-'
                      )}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Saraban Memorandum Note (บันทึกข้อความประกอบ) */}
          <div className={`p-4 rounded-xl border ${
            isDarkMode ? 'bg-[#0f172a] border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 font-['Sarabun']">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>บันทึกข้อความประกอบทางสารบรรณ (Official Saraban Note)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">เลขที่ ผ. / วันที่กันตำแหน่ง:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {record.reservationNoDate || '-'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-red-500 dark:text-red-400 block text-[11px] font-semibold">หมายเหตุ / ผลคำวินิจฉัย:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {record.notes || 'ไม่มีหมายเหตุเพิ่มเติม'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">ผู้บันทึกล่าสุด:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block truncate" title={record.updatedBy}>
                  {record.updatedBy || 'ระบบสารบรรณกลาง'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className={`px-6 py-3.5 border-t flex items-center justify-between text-xs ${
          isDarkMode ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <div>
            บันทึกเมื่อ: <span className="font-mono text-slate-700 dark:text-slate-300">{new Date(record.updatedAt).toLocaleDateString('th-TH')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenEdit(record);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-200" />
              <span>แก้ไขรายการนี้ (18 ช่องข้อมูล)</span>
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer border ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
