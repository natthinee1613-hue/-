import React, { useState } from 'react';
import { 
  Shield, 
  Upload, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  History, 
  Plus, 
  UserCheck, 
  RefreshCw,
  Sun,
  Moon,
  Video,
  Sparkles,
  Globe,
  UploadCloud
} from 'lucide-react';
import { getCurrentOfficerName, setCurrentOfficerName } from '../utils/auditLogger';
import { MaroonAnimatedBackground } from './MaroonAnimatedBackground';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenUploadModal: () => void;
  onOpenAuditModal: () => void;
  onOpenPrintModal: () => void;
  onOpenVeoModal: () => void;
  onOpenPublishModal: () => void;
  hasUnpublishedChanges: boolean;
  serverVersion: number;
  serverLastPublishedAt: string | null;
  onExportExcel: () => void;
  onDownloadTemplate: () => void;
  onResetData: () => void;
  currentCategory: string;
  totalRecords: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenUploadModal,
  onOpenAuditModal,
  onOpenPrintModal,
  onOpenVeoModal,
  onOpenPublishModal,
  hasUnpublishedChanges,
  serverVersion,
  serverLastPublishedAt,
  onExportExcel,
  onDownloadTemplate,
  onResetData,
  currentCategory,
  totalRecords,
  isDarkMode,
  onToggleTheme,
}) => {
  const [officerName, setOfficerName] = useState(getCurrentOfficerName());
  const [isEditingOfficer, setIsEditingOfficer] = useState(false);
  const [tempOfficer, setTempOfficer] = useState(officerName);

  const handleSaveOfficer = () => {
    if (tempOfficer.trim()) {
      setCurrentOfficerName(tempOfficer.trim());
      setOfficerName(tempOfficer.trim());
    }
    setIsEditingOfficer(false);
  };

  return (
    <header className="border-b border-[#5c0e1a]/80 text-white relative overflow-hidden shadow-2xl bg-[#280408] transition-colors">
      {/* Dynamic Maroon Animated Background with Canvas Waves, Stardust & Royal Emblem Effects */}
      <MaroonAnimatedBackground />

      {/* Subtle Royal Police Golden Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-300 via-rose-500 to-amber-600 shadow-md relative z-10" />

      {/* Top Utility Bar */}
      <div className="border-b border-rose-950/60 bg-black/40 backdrop-blur-md py-1.5 px-3 sm:px-6 relative z-10">
        <div className="max-w-[1600px] mx-auto flex items-center justify-end gap-2 text-xs">
          <div className="flex items-center gap-2">
            {/* Live Web Sync Status Pill */}
            <button
              onClick={onOpenPublishModal}
              title={hasUnpublishedChanges ? 'มีข้อมูลในตารางรอเผยแพร่ลงเว็ป คลิกเพื่อบันทึกและเผยแพร่' : 'ข้อมูลในเครื่องซิงค์ตรงกับเว็ปล่าสุดแล้ว คลิกเพื่อดูรายละเอียดหรือจัดการ'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs transition-colors cursor-pointer shadow-xs font-['Sarabun'] ${
                hasUnpublishedChanges
                  ? 'bg-amber-950/85 hover:bg-amber-900 border-amber-500/60 text-amber-200'
                  : 'bg-emerald-950/75 hover:bg-emerald-900 border-emerald-500/50 text-emerald-200'
              }`}
            >
              <Globe className={`w-3.5 h-3.5 ${hasUnpublishedChanges ? 'text-amber-400' : 'text-emerald-400'}`} />
              <span className="font-medium hidden sm:inline">
                {hasUnpublishedChanges ? 'เว็ป: รอเผยแพร่' : `เว็ป: ซิงค์แล้ว (v${serverVersion || 1})`}
              </span>
              {hasUnpublishedChanges ? (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              )}
            </button>

            {/* Current Officer Badge */}
            <div className="relative">
              {isEditingOfficer ? (
                <div className="flex items-center gap-1 bg-[#1c0306] border border-amber-400/90 rounded-md p-0.5 shadow-lg">
                  <input
                    type="text"
                    value={tempOfficer}
                    onChange={(e) => setTempOfficer(e.target.value)}
                    className="bg-[#2d050a] text-xs text-white px-2 py-0.5 rounded outline-none border border-rose-800/80 w-36 font-['Sarabun'] focus:border-amber-400"
                    placeholder="ยศ-ชื่อ เจ้าหน้าที่ผู้บันทึก"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveOfficer}
                    className="px-2 py-0.5 text-xs bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded font-bold cursor-pointer shadow-xs"
                  >
                    บันทึก
                  </button>
                  <button
                    onClick={() => setIsEditingOfficer(false)}
                    className="px-1.5 py-0.5 text-xs text-rose-300 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setTempOfficer(officerName);
                    setIsEditingOfficer(true);
                  }}
                  title="คลิกเพื่อแก้ไขชื่อเจ้าหน้าที่ผู้ลงบันทึกสารบรรณ"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/35 hover:bg-black/50 border border-rose-500/30 text-xs text-rose-100 transition-colors cursor-pointer shadow-xs"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate max-w-[120px] sm:max-w-[160px] font-medium font-['Sarabun']">
                    {officerName}
                  </span>
                  <span className="text-[10px] text-amber-300 font-['Sarabun'] bg-amber-950/70 px-1 py-0.2 rounded border border-amber-500/40">
                    แก้ไข
                  </span>
                </button>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              title={isDarkMode ? 'เปลี่ยนเป็นโหมดสว่าง (Light Mode)' : 'เปลี่ยนเป็นโหมดมืด (Dark Mode)'}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-rose-500/30 bg-black/35 hover:bg-black/50 text-xs font-medium text-rose-100 transition-all cursor-pointer font-['Sarabun'] shadow-xs"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-rose-100 hidden sm:inline">โหมดสว่าง</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-rose-100 hidden sm:inline">โหมดมืด</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Main Cover Banner */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          
          {/* Emblem & Grand Titles */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            
            {/* Grand Police Emblem Shield Badge in Royal Maroon & Gold */}
            <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 rounded-2xl bg-gradient-to-br from-[#731221] via-[#480913] to-[#200307] border-2 border-amber-400/80 p-2 shadow-[0_0_25px_rgba(225,29,72,0.4)] shrink-0 group transition-all duration-300 hover:scale-105">
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                <Shield className="w-8 h-8 sm:w-9 sm:h-9 text-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.65)] transition-transform duration-300 group-hover:rotate-6" />
                <span className="text-[10px] sm:text-[11px] font-bold text-amber-200 font-['Sarabun'] mt-0.5 tracking-wider drop-shadow-xs">
                  งานประทวน 1
                </span>
              </div>

              {/* Status Indicator */}
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-emerald-600 rounded-full border border-amber-400/70 flex items-center gap-1 text-[9px] font-medium text-white shadow-md font-['Sarabun']">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                <span>พร้อมใช้</span>
              </div>
            </div>

            {/* Typography Section (ตามระบบสารบรรณ) */}
            <div className="space-y-1 font-['Sarabun']">
              {/* Agency Kicker Line */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex-wrap">
                <span className="font-semibold text-amber-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
                  ฝ่ายควบคุมอัตรากำลัง อต.
                </span>
                <span className="text-rose-300/80 hidden sm:inline">·</span>
                <span className="text-rose-100/90">กองอัตรากำลังพล สำนักงานกำลังพล สำนักงานตำรวจแห่งชาติ</span>
              </div>
              
              {/* Main Title in TH Sarabun */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-normal text-white leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                ระบบฐานข้อมูลทำเนียบกำลังพลและการกันตำแหน่งในแต่ละกรณี ข้าราชการตำรวจชั้นประทวน (งานประทวน 1)
              </h1>
              
              {/* Metadata Line */}
              <div className="text-xs sm:text-sm text-rose-100/90 flex items-center gap-2 flex-wrap pt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                <span>ระบบสารบรรณและทะเบียนอัตรากำลังพล ๑๓ กลุ่มกรณี</span>
                <span className="text-amber-400/80 font-bold">·</span>
                <span className="text-amber-300 font-medium">ประจำปีงบประมาณ ๒๕๖๙</span>
                <span className="text-amber-400/80 font-bold hidden md:inline">·</span>
                <span className="text-rose-200/80 hidden md:inline">ทั้งหมด {totalRecords} ตำแหน่งในระบบ</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar on Cover */}
          <div className="flex flex-wrap items-center gap-1.5 justify-start lg:justify-end bg-black/45 backdrop-blur-md p-2 rounded-xl border border-rose-500/30 shadow-2xl font-['Sarabun']">
            
            {/* Secondary Action: Template Download */}
            <button
              onClick={onDownloadTemplate}
              title="ดาวน์โหลดแบบฟอร์ม Excel 13 หมวดสำหรับกรอกข้อมูล"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-900/60 bg-[#3b0810]/80 hover:bg-[#540d17] hover:border-rose-400/50 text-xs font-medium text-rose-100 hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>แบบฟอร์ม</span>
            </button>

            {/* Secondary Action: Upload */}
            <button
              onClick={onOpenUploadModal}
              title="อัปโหลดไฟล์ Excel (.xlsx, .xls) หรือ CSV ทุกชีต/ทุกหมวด"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-900/60 bg-[#3b0810]/80 hover:bg-[#540d17] hover:border-rose-400/50 text-xs font-medium text-rose-100 hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-blue-300" />
              <span>นำเข้า</span>
            </button>

            {/* Secondary Action: Export Excel */}
            <button
              onClick={onExportExcel}
              title="ส่งออกข้อมูลเป็น Excel (.xlsx) แยกชีตตามหมวด"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-900/60 bg-[#3b0810]/80 hover:bg-[#540d17] hover:border-rose-400/50 text-xs font-medium text-rose-100 hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>ส่งออก</span>
            </button>

            {/* Veo 3 AI Video Generator Button */}
            <button
              onClick={onOpenVeoModal}
              title="สร้างวิดีโอประชาสัมพันธ์และจำลองเหตุการณ์ด้วย AI Veo 3"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-900/60 bg-[#3b0810]/80 hover:bg-[#540d17] hover:border-rose-400/50 text-xs font-medium text-rose-100 hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>วิดีโอ AI</span>
            </button>

            {/* Secondary Action: Print Report */}
            <button
              onClick={onOpenPrintModal}
              title="พิมพ์แบบรายงานสรุปสารบรรณเสนอผู้บังคับบัญชา"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-900/60 bg-[#3b0810]/80 hover:bg-[#540d17] hover:border-rose-400/50 text-xs font-medium text-rose-100 hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">พิมพ์ สร.๑</span>
            </button>

            {/* Secondary Action: Audit Log */}
            <button
              onClick={onOpenAuditModal}
              title="ดูประวัติการบันทึก/แก้ไข/ลบ ตามระเบียบงานสารบรรณ"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-900/60 bg-[#3b0810]/80 hover:bg-[#540d17] hover:border-rose-400/50 text-xs font-medium text-rose-100 hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <History className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden sm:inline">ประวัติ</span>
            </button>

            {/* Secondary Action: Reset data */}
            <button
              onClick={onResetData}
              title="คืนค่าข้อมูลเริ่มต้น 54 รายการ"
              className="p-1.5 rounded-lg border border-rose-900/60 bg-[#3b0810]/80 hover:bg-[#540d17] hover:border-rose-400/50 text-rose-200 hover:text-white transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Web Publish Action Button */}
            <button
              onClick={onOpenPublishModal}
              title="บันทึกและเผยแพร่ข้อมูลตารางลงเว็ป เพื่อให้ทุกคนที่เปิดเว็ปไซต์เห็นข้อมูลล่าสุด"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-md ${
                hasUnpublishedChanges
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.5)]'
                  : 'border-rose-900/60 bg-[#3b0810]/80 hover:bg-[#540d17] hover:border-rose-400/50 text-rose-100 hover:text-white'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-emerald-300" />
              <span>เผยแพร่ลงเว็ป</span>
              {hasUnpublishedChanges && (
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping ml-0.5" />
              )}
            </button>

            {/* Primary Action Button: + เพิ่มรายการ */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-bold transition-all shadow-[0_2px_12px_rgba(251,191,36,0.4)] border border-amber-300/80 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ เพิ่มรายการ</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

