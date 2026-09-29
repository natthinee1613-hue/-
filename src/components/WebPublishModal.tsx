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
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { PolicePositionRecord } from '../types/police';
import { 
  formatThaiDateTime, 
  exportDatabaseBackupJson, 
  parseDatabaseBackupJson 
} from '../utils/dataSync';

interface WebPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: PolicePositionRecord[];
  officerName: string;
  isDarkMode: boolean;
  serverVersion: number;
  serverLastPublishedAt: string | null;
  serverLastPublishedBy: string | null;
  serverTotalRecords: number;
  hasUnpublishedChanges: boolean;
  onPublishToWeb: (note?: string) => Promise<boolean>;
  onPullFromServer: () => Promise<boolean>;
  onClearCacheAndReload: () => void;
  onResetData: () => void;
  onImportBackup: (backupRecords: PolicePositionRecord[]) => void;
}

export const WebPublishModal: React.FC<WebPublishModalProps> = ({
  isOpen,
  onClose,
  records,
  officerName,
  isDarkMode,
  serverVersion,
  serverLastPublishedAt,
  serverLastPublishedBy,
  serverTotalRecords,
  hasUnpublishedChanges,
  onPublishToWeb,
  onPullFromServer,
  onClearCacheAndReload,
  onResetData,
  onImportBackup,
}) => {
  const [publishNote, setPublishNote] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePublish = async () => {
    setIsPublishing(true);
    setErrorMsg(null);
    setPublishSuccessMsg(null);
    try {
      const ok = await onPublishToWeb(publishNote.trim() || undefined);
      if (ok) {
        setPublishSuccessMsg('เผยแพร่ข้อมูลตารางลงเว็ปสำเร็จเรียบร้อย! ข้อมูลล่าสุดพร้อมใช้งานสำหรับทุกคน');
        setPublishNote('');
      } else {
        setErrorMsg('การเผยแพร่ข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'เกิดข้อผิดพลาดในการเผยแพร่');
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePull = async () => {
    setIsPulling(true);
    setErrorMsg(null);
    setPublishSuccessMsg(null);
    try {
      const ok = await onPullFromServer();
      if (ok) {
        setPublishSuccessMsg('ดึงข้อมูลล่าสุดจากเว็ปมาอัปเดตบนหน้าจอเรียบร้อยแล้ว');
      } else {
        setErrorMsg('ไม่สามารถดึงข้อมูลจากเซิร์ฟเวอร์ได้');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setIsPulling(false);
    }
  };

  const handleBackupUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const importedRecords = await parseDatabaseBackupJson(file);
      onImportBackup(importedRecords);
      setPublishSuccessMsg(`นำเข้าข้อมูลสำรองจำนวน ${importedRecords.length} รายการ เรียบร้อยแล้ว (อย่าลืมกดเผยแพร่ลงเว็ปเพื่อบันทึกลงระบบ)`);
    } catch (err: any) {
      setErrorMsg(err.message || 'ไฟล์สำรองข้อมูลไม่ถูกต้อง');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
              <Globe className="w-5 h-5 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>ระบบเผยแพร่และอัปเดตข้อมูลตารางลงเว็ป</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                  Web Sync Center
                </span>
              </h2>
              <p className="text-xs text-rose-200/90">
                ซิงค์ข้อมูลทำเนียบกำลังพลระหว่างเครื่องและเซิร์ฟเวอร์กลาง เพื่อให้เว็ปแสดงข้อมูลชุดล่าสุดเสมอ
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
          {publishSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{publishSuccessMsg}</div>
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
                สถานะระบบฐานข้อมูลบนเว็ป (Web Server Status)
              </span>
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                ออนไลน์ พร้อมใช้งาน
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="text-slate-400">เวอร์ชันข้อมูลบนเว็ป:</div>
                <div className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span>Version {serverVersion || 1}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-400">จำนวนข้อมูลบนเว็ป:</div>
                <div className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>{serverTotalRecords || records.length} ตำแหน่ง</span>
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                <div className="text-slate-400">เผยแพร่ครั้งล่าสุดเมื่อ:</div>
                <div className="font-medium text-slate-700 dark:text-slate-200">
                  {formatThaiDateTime(serverLastPublishedAt)}
                </div>
                {serverLastPublishedBy && (
                  <div className="text-[11px] text-slate-400">
                    โดย: <span className="text-amber-500">{serverLastPublishedBy}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Current Local State Badge */}
            <div className={`mt-3.5 p-2.5 rounded-lg border text-xs flex items-center justify-between ${
              hasUnpublishedChanges 
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-800 dark:text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
            }`}>
              <div className="flex items-center gap-2">
                {hasUnpublishedChanges ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
                <span>
                  {hasUnpublishedChanges 
                    ? `มีการเปลี่ยนแปลงข้อมูลในตาราง (${records.length} ตำแหน่ง) ที่ยังไม่ได้เผยแพร่ลงเว็ป`
                    : `ข้อมูลในเครื่องตรงกับข้อมูลล่าสุดบนเว็ปแล้ว (${records.length} ตำแหน่ง)`
                  }
                </span>
              </div>
              <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-black/20">
                {hasUnpublishedChanges ? 'รอเผยแพร่' : 'ซิงค์แล้ว'}
              </span>
            </div>
          </div>

          {/* Section 1: Publish Now to Web (Primary Action) */}
          <div className="space-y-2">
            <label className="block font-bold text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
              ๑. บันทึกและเผยแพร่ข้อมูลลงเว็ป (Publish to Web)
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              เมื่อกดปุ่มนี้ ข้อมูลตารางทั้งหมด {records.length} รายการ (รวมรายการที่เพิ่ม แก้ไข หรือนำเข้าจาก Excel) จะถูกจัดเก็บลงฐานข้อมูลกลางของเว็ปไซต์ทันที ผู้ใช้ทุกคนที่เปิดแอปจะได้รับข้อมูลชุดใหม่นี้
            </p>

            <div className="space-y-2 pt-1">
              <input
                type="text"
                value={publishNote}
                onChange={(e) => setPublishNote(e.target.value)}
                placeholder="ระบุหมายเหตุการเผยแพร่ เช่น 'อัปเดตข้อมูล นสต. และคำสั่งย้าย 29 ก.ย. 69' (ไม่บังคับ)"
                className={`w-full px-3 py-2 rounded-lg text-xs border outline-none font-['Sarabun'] ${
                  isDarkMode 
                    ? 'bg-black/50 border-rose-900/60 focus:border-amber-400 text-white' 
                    : 'bg-white border-slate-300 focus:border-rose-600 text-slate-900'
                }`}
              />

              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-[0_4px_16px_rgba(251,191,36,0.35)] border border-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>กำลังบันทึกและเผยแพร่ข้อมูลลงเว็ป...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5 text-slate-950" />
                    <span>🚀 บันทึกและเผยแพร่ข้อมูลลงเว็ปทันที ({records.length} ตำแหน่ง)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 2: Sync / Pull from Server & Clear Local Cache */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <label className="block font-bold text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
              ๒. การดึงข้อมูลและแก้ไขปัญหาแคชค้าง (Sync & Cache Troubleshooting)
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              หากเปิดเว็ปแล้วข้อมูลยังไม่อัปเดตเนื่องจากเบราว์เซอร์จำข้อมูลเดิมไว้ ท่านสามารถกดดึงข้อมูลล่าสุดหรือล้างแคชได้ที่นี่
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={handlePull}
                disabled={isPulling}
                className={`px-3 py-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'bg-rose-950/40 border-rose-900/60 hover:bg-rose-900/50 text-rose-200' 
                    : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <DownloadCloud className="w-4 h-4 text-blue-400" />
                <span>ดึงข้อมูลล่าสุดจากเว็ป</span>
              </button>

              <button
                onClick={onClearCacheAndReload}
                className={`px-3 py-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'bg-rose-950/40 border-rose-900/60 hover:bg-rose-900/50 text-amber-300' 
                    : 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-800'
                }`}
              >
                <RefreshCw className="w-4 h-4 text-amber-500" />
                <span>ล้างแคชเครื่องและโหลดใหม่</span>
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
                <span>ดาวน์โหลดสำรอง JSON</span>
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
          <button
            onClick={onResetData}
            className="text-rose-500 hover:text-rose-400 font-medium underline cursor-pointer"
          >
            คืนค่าเริ่มต้น (54 รายการ)
          </button>

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
