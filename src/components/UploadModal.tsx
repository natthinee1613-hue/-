import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Layers, 
  Download,
  ClipboardList
} from 'lucide-react';
import { PoliceCategory, PolicePositionRecord, POLICE_CATEGORIES } from '../types/police';
import { parseExcelOrCsvFile, FileParseResult, downloadTemplate } from '../utils/excelHelper';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (
    newRecords: PolicePositionRecord[],
    importMode: 'APPEND' | 'REPLACE_MATCHING' | 'REPLACE_ALL',
    summaryMessage: string
  ) => void;
  currentCategory: PoliceCategory | 'ALL';
  officerName: string;
  isDarkMode?: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  currentCategory,
  officerName,
  isDarkMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'paste'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parseResult, setParseResult] = useState<FileParseResult | null>(null);
  const [importMode, setImportMode] = useState<'APPEND' | 'REPLACE_MATCHING' | 'REPLACE_ALL'>('APPEND');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [targetCategoryForPaste, setTargetCategoryForPaste] = useState<PoliceCategory>(
    currentCategory === 'ALL' ? 'ให้ออกจากราชการไว้ก่อน' : currentCategory
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const fallbackCat = currentCategory === 'ALL' ? 'ให้ออกจากราชการไว้ก่อน' : currentCategory;
      const result = await parseExcelOrCsvFile(file, fallbackCat);
      if (result.allRecords.length === 0) {
        setErrorMessage('ไม่พบข้อมูลในไฟล์ที่เลือก กรุณาตรวจสอบว่ามีหัวตารางหรือแถวข้อมูลที่ถูกต้อง');
        setParseResult(null);
      } else {
        setParseResult(result);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`เกิดข้อผิดพลาดในการอ่านไฟล์: ${err?.message || 'ไฟล์อาจเสียหายหรือไม่รองรับ'}`);
      setParseResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteProcess = async () => {
    if (!pastedText.trim()) {
      setErrorMessage('กรุณาวางข้อความ CSV หรือข้อความตารางที่คัดลอกจาก Excel');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const blob = new Blob([pastedText], { type: 'text/csv;charset=utf-8;' });
      const mockFile = new File([blob], 'pasted_data.csv', { type: 'text/csv' });
      const result = await parseExcelOrCsvFile(mockFile, targetCategoryForPaste);

      if (result.allRecords.length === 0) {
        setErrorMessage('ไม่สามารถแปลงข้อความที่วางเป็นข้อมูลสารบรรณได้ กรุณาตรวจสอบโครงสร้างหัวตาราง');
        setParseResult(null);
      } else {
        setParseResult(result);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`เกิดข้อผิดพลาด: ${err?.message}`);
      setParseResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (!parseResult || parseResult.allRecords.length === 0) return;

    const total = parseResult.allRecords.length;
    const sheetsCount = parseResult.sheets.length;
    const msg = `นำเข้าสำเร็จ ${total} รายการ จาก ${sheetsCount} ชีต/หมวดหมู่ (${parseResult.fileName})`;

    onImportSuccess(parseResult.allRecords, importMode, msg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className={`relative w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden my-8 border transition-colors animate-in fade-in zoom-in-95 duration-200 ${
        isDarkMode 
          ? 'bg-[#1e293b] border-slate-700 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between transition-colors ${
          isDarkMode ? 'bg-[#0f172a] border-slate-700 text-slate-100' : 'bg-[#0f243c] border-blue-900/60 text-white'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-600/40">
                  ระบบนำเข้าข้อมูลสารบรรณ
                </span>
                <span className="text-xs text-blue-200/80">รองรับ Excel ทุกชีต & CSV</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                อัปโหลดข้อมูลการกันตำแหน่ง (ทุกตาราง / ทุกชีต / 13 หมวด)
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

        {/* Tab Selector: Upload File vs Paste Text */}
        <div className={`border-b px-6 py-2.5 flex items-center justify-between transition-colors ${
          isDarkMode ? 'bg-[#0f172a]/70 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('file');
                setErrorMessage(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'file'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>อัปโหลดไฟล์ Excel / CSV</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('paste');
                setErrorMessage(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'paste'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>วางข้อความ CSV / คัดลอกจาก Excel</span>
            </button>
          </div>

          {/* Download Template helper */}
          <button
            onClick={downloadTemplate}
            className="text-[11px] text-blue-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลดแบบฟอร์ม 13 หมวด (.xlsx)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
          
          {/* File Upload Mode */}
          {activeTab === 'file' && (
            <div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-950/30 ring-4 ring-blue-500/20'
                    : 'border-slate-700 hover:border-blue-500/60 bg-slate-950/40 hover:bg-slate-800/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-md">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>

                <h3 className="text-sm font-bold text-white mb-1">
                  ลากไฟล์ Excel (.xlsx, .xls) หรือ CSV มาวางที่นี่
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  หรือคลิกเพื่อเลือกไฟล์จากคอมพิวเตอร์ของคุณ
                </p>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[11px] text-slate-300 border border-slate-700">
                  <span>รองรับไฟล์ที่มีหลายชีต (แยก 13 หมวด) และคอลัมน์มาตรฐานสารบรรณ</span>
                </div>
              </div>
            </div>
          )}

          {/* Paste Text Mode */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">
                  วางข้อความ CSV หรือข้อความที่คัดลอกจากตาราง Excel:
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">หมวดเป้าหมาย:</span>
                  <select
                    value={targetCategoryForPaste}
                    onChange={(e) => setTargetCategoryForPaste(e.target.value as any)}
                    className="bg-slate-800 border border-slate-700 text-xs text-white rounded px-2 py-1"
                  >
                    {POLICE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="วางข้อความหัวตารางและแถวข้อมูลที่นี่ เช่น:&#10;ลำดับที่,ผ. ....../วันเดือนปี,กันตำแหน่งตามหนังสือ,ที่...,ลงวันที่,เลขตำแหน่ง,ระดับตำแหน่ง...&#10;1,งาน ส.,วน.,0006.2/71,26-ส.ค.-67,1205 12502 1216,ผบ.หมู่..."
                rows={7}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handlePasteProcess}
                  disabled={isLoading || !pastedText.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold"
                >
                  {isLoading ? 'กำลังประมวลผล...' : 'วิเคราะห์ข้อความ'}
                </button>
              </div>
            </div>
          )}

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-700/60 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Parse Result Summary */}
          {parseResult && (
            <div className="bg-slate-950/60 rounded-xl p-4 border border-emerald-800/60 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      อ่านข้อมูลสำเร็จจาก: {parseResult.fileName}
                    </h4>
                    <span className="text-xs text-emerald-400">
                      พบข้อมูลทั้งหมด {parseResult.allRecords.length} รายการ จาก {parseResult.sheets.length} ชีต
                    </span>
                  </div>
                </div>

                <span className="text-xs bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-700 text-emerald-300 font-bold">
                  พร้อมนำเข้า
                </span>
              </div>

              {/* Sheet Breakdown */}
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  สรุปรายละเอียดรายชีต / หมวดหมู่:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {parseResult.sheets.map((sheet, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="text-slate-200 font-medium truncate" title={sheet.sheetName}>
                          {sheet.sheetName}
                        </span>
                        <span className="text-[10px] text-slate-400">➔ {sheet.category}</span>
                      </div>
                      <span className="text-emerald-400 font-bold ml-2 shrink-0">
                        {sheet.totalFound} แถว
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Import Mode Radio Options */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  เลือกรูปแบบการนำเข้าข้อมูล (Import Mode):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  
                  <label
                    className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      importMode === 'APPEND'
                        ? 'bg-blue-950/60 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'APPEND'}
                      onChange={() => setImportMode('APPEND')}
                      className="mt-0.5 text-blue-600"
                    />
                    <div>
                      <div className="font-bold text-slate-200">เพิ่มต่อท้าย (Append)</div>
                      <div className="text-[11px] text-slate-400">
                        คงข้อมูลเดิมไว้ และเพิ่มข้อมูลใหม่เข้าไป
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      importMode === 'REPLACE_MATCHING'
                        ? 'bg-amber-950/60 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'REPLACE_MATCHING'}
                      onChange={() => setImportMode('REPLACE_MATCHING')}
                      className="mt-0.5 text-amber-600"
                    />
                    <div>
                      <div className="font-bold text-slate-200">แทนที่เฉพาะหมวดนี้</div>
                      <div className="text-[11px] text-slate-400">
                        ล้างเฉพาะหมวดที่มีในไฟล์ แล้วใส่ข้อมูลใหม่
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      importMode === 'REPLACE_ALL'
                        ? 'bg-red-950/60 border-red-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'REPLACE_ALL'}
                      onChange={() => setImportMode('REPLACE_ALL')}
                      className="mt-0.5 text-red-600"
                    />
                    <div>
                      <div className="font-bold text-slate-200">แทนที่ทั้งหมด (Master)</div>
                      <div className="text-[11px] text-slate-400">
                        ล้างฐานข้อมูลเดิมทั้งหมดด้วยไฟล์ชุดใหม่
                      </div>
                    </div>
                  </label>

                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            เจ้าหน้าที่ผู้นำเข้า: <strong className="text-slate-200">{officerName}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              ยกเลิก
            </button>

            <button
              onClick={handleConfirmImport}
              disabled={!parseResult || parseResult.allRecords.length === 0}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white transition-all shadow-md shadow-emerald-900/30"
            >
              <CheckCircle className="w-4 h-4" />
              <span>ยืนยันการนำเข้าข้อมูล ({parseResult ? parseResult.allRecords.length : 0} รายการ)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
