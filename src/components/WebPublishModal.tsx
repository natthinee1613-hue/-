import React, { useState, useRef } from 'react';
import { 
  X, 
  Globe, 
  UploadCloud, 
  DownloadCloud, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  FileJson, 
  Server, 
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  Layers
} from 'lucide-react';
import { PolicePositionRecord } from '../types/police';
import { 
  formatThaiDateTime, 
  exportDatabaseBackupJson, 
  parseDatabaseBackupJson,
  clearBrowserCache
} from '../utils/dataSync';
import { INITIAL_POLICE_RECORDS } from '../data/initialData';

interface WebPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: PolicePositionRecord[];
  officerName: string;
  isDarkMode: boolean;
  totalRecords: number;
  onResetToOfficialData: () => void;
  onClearCache: () => void;
  onImportBackup: (backupRecords: PolicePositionRecord[]) => void;
  onExportExcel: () => void;
}

export const WebPublishModal: React.FC<WebPublishModalProps> = ({
  isOpen,
  onClose,
  records,
  officerName,
  isDarkMode,
  totalRecords,
  onResetToOfficialData,
  onClearCache,
  onImportBackup,
  onExportExcel,
}) => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleBackupUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const importedRecords = await parseDatabaseBackupJson(file);
      onImportBackup(importedRecords);
      setSuccessMsg(`นำเข้าข้อมูลสำรองจำนวน ${importedRecords.length} รายการ เรียบร้อยแล้ว`);
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'ไฟล์สำรองข้อมูลไม่ถูกต้อง');
      setSuccessMsg(null);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSyncOfficial = () => {
    onResetToOfficialData();
    setSuccessMsg(`อัปเดตข้อมูลเป็นชุดทางการล่าสุด ${INITIAL_POLICE_RECORDS.length} ตำแหน่ง เรียบร้อยแล้ว`);
    setErrorMsg(null);
  };

  const handleClearCacheAndReset = () => {
    onClearCache();
    setSuccessMsg(`ล้างแคชเครื่องและโหลดข้อมูลทางการล่าสุด ${INITIAL_POLICE_RECORDS.length} ตำแหน่ง เรียบร้อยแล้ว`);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col max-h-[92vh] overflow-hidden font-['Sarabun'] ${
        isDarkMode 
          ? 'bg-[#180a0e] text-slate-100 border-rose-900/60' 
          : 'bg-white text-slate-800 border-slate-200'
      }`}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-rose-900/40 bg-gradient-to-r from-[#3b0810] via-[#5c0e1a] to-[#3b0810] text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center shadow-inner">
              <Globe className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>ระบบจัดการและอัปเดตฐานข้อมูลตารางลงเว็ป</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                  Data Sync Center
                </span>
              </h2>
              <p className="text-xs text-rose-200/90">
                ข้อมูลทำเนียบกำลังพล ๑๓ กลุ่มกรณี ได้รับการบรรจุเข้าสู่ระบบเว็ปไซต์หลักเรียบร้อยแล้ว
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-rose-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          
          {/* Notifications */}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMsg}</div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-800 dark:text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          {/* Status Panel */}
          <div className={`p-4 rounded-xl border ${
            isDarkMode ? 'bg-black/40 border-rose-950' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="text-xs font-bold text-amber-500 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 uppercase tracking-wide">
                <Server className="w-3.5 h-3.5 text-amber-500" />
                สถานะฐานข้อมูลทำเนียบกำลังพลบนเว็ป (Master Database)
              </span>
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                อัปเดตล่าสุดพร้อมใช้งาน
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="text-slate-400">เวอร์ชันฐานข้อมูลในระบบ:</div>
                <div className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span>รุ่นปี ๒๕๖๙ (๕๔๕ ตำแหน่ง ๑๓ หมวด)</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-400">จำนวนตำแหน่งปัจจุบันในตาราง:</div>
                <div className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>{records.length} ตำแหน่ง</span>
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                <div className="text-slate-400">ชุดข้อมูลมาตรฐาน:</div>
                <div className="font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-500" />
                  <span>ข้อมูลสมบูรณ์จากไฟล์ "กันตำแหน่งทุกกรณี งานประทวน 1.xlsx" (๕๔๕ รายการ)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Update to Latest Official 545 Records */}
          <div className="space-y-2">
            <label className="block font-bold text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
              ๑. อัปเดตหรือกู้คืนเป็นชุดข้อมูลทางการ ๕๔๕ ตำแหน่งล่าสุด
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              หากหน้าจอของท่านแสดงข้อมูลเก่า หรือต้องการดึงข้อมูลทางการ ๕๔๕ ตำแหน่ง (ครบ ๑๓ กลุ่มกรณี) กลับคืนมา สามารถกดปุ่มนี้เพื่อซิงค์ได้ทันที
            </p>

            <button
              onClick={handleSyncOfficial}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-[0_4px_16px_rgba(251,191,36,0.35)] border border-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className="w-4 h-4 text-slate-950" />
              <span>ดึงและอัปเดตเป็นฐานข้อมูลทางการล่าสุด ({INITIAL_POLICE_RECORDS.length} ตำแหน่ง)</span>
            </button>
          </div>

          {/* Section 2: Clear Stale Cache */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <label className="block font-bold text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
              ๒. แก้ไขปัญหาแคชเบราว์เซอร์ค้าง (Troubleshooting)
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              หากเบราว์เซอร์ยังคงจดจำข้อมูลเก่าไว้จากครั้งก่อน ให้กดปุ่ม "ล้างแคชเครื่องและโหลดใหม่" เพื่อบังคับให้เบราว์เซอร์รับข้อมูลชุดใหม่ ๕๔๕ รายการ
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleClearCacheAndReset}
                className={`px-3 py-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'bg-rose-950/40 border-rose-900/60 hover:bg-rose-900/50 text-amber-300' 
                    : 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-800'
                }`}
              >
                <RefreshCw className="w-4 h-4 text-amber-500" />
                <span>ล้างแคชเครื่องและโหลดใหม่</span>
              </button>

              <button
                onClick={onExportExcel}
                className={`px-3 py-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'bg-rose-950/40 border-rose-900/60 hover:bg-rose-900/50 text-emerald-300' 
                    : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-800'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>ส่งออกตาราง Excel 13 หมวด</span>
              </button>
            </div>
          </div>

          {/* Section 3: Backup & Restore */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <label className="block font-bold text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
              ๓. สำรองและกู้คืนฐานข้อมูล (Database Backup & Restore)
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => exportDatabaseBackupJson(records)}
                className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'bg-black/30 border-rose-900/50 hover:bg-black/50 text-slate-200' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <FileJson className="w-4 h-4 text-emerald-500" />
                <span>ดาวน์โหลดสำรอง JSON ({records.length} รายการ)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'bg-black/30 border-rose-900/50 hover:bg-black/50 text-slate-200' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <UploadCloud className="w-4 h-4 text-blue-500" />
                <span>กู้คืนจากไฟล์ JSON</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleBackupUpload}
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-xs shrink-0 ${
          isDarkMode ? 'bg-black/40 border-rose-950 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <div className="text-[11px] text-slate-400">
            ระบบฐานข้อมูลทำเนียบกำลังพล อต. ตร. (งานประทวน ๑)
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold transition-colors cursor-pointer text-slate-800 dark:text-slate-200"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
