import React, { useState } from 'react';
import { AuditLogItem } from '../types/police';
import { getAuditLogs, clearAuditLogs } from '../utils/auditLogger';
import { 
  History, 
  X, 
  Search, 
  Trash2, 
  Download, 
  UserCheck, 
  Clock, 
  FileEdit, 
  PlusCircle, 
  Upload, 
  ShieldAlert 
} from 'lucide-react';
import { exportToCsv } from '../utils/excelHelper';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose, isDarkMode = false }) => {
  const [logs, setLogs] = useState<AuditLogItem[]>(getAuditLogs());
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  if (!isOpen) return null;

  const refreshLogs = () => {
    setLogs(getAuditLogs());
  };

  const handleClearLogs = () => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติการแก้ไขทั้งหมด?')) {
      clearAuditLogs();
      setLogs([]);
    }
  };

  const handleExportAuditLogs = () => {
    // Generate CSV for audit logs
    const headers = [
      'วันที่-เวลา',
      'เจ้าหน้าที่ผู้ปฏิบัติงาน',
      'การกระทำ',
      'หมวดหมู่',
      'เลขตำแหน่ง',
      'กำลังพลเป้าหมาย',
      'ช่องที่แก้ไข',
      'ค่าก่อนแก้ไข (Old Value)',
      'ค่าหลังแก้ไข (New Value)',
      'รายละเอียด'
    ];

    const escapeCsv = (val: any) => {
      const s = String(val ?? '');
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const rows = logs.map(l => [
      escapeCsv(l.timestamp),
      escapeCsv(l.officerName),
      escapeCsv(l.action),
      escapeCsv(l.category),
      escapeCsv(l.positionNumber),
      escapeCsv(l.targetPerson),
      escapeCsv(l.fieldChanged),
      escapeCsv(l.oldValue),
      escapeCsv(l.newValue),
      escapeCsv(l.details)
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `บันทึกประวัติการแก้ไข_สารบรรณ_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter(l => {
    if (selectedAction !== 'ALL' && l.action !== selectedAction) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        l.officerName.toLowerCase().includes(q) ||
        (l.positionNumber && l.positionNumber.toLowerCase().includes(q)) ||
        (l.targetPerson && l.targetPerson.toLowerCase().includes(q)) ||
        (l.details && l.details.toLowerCase().includes(q)) ||
        (l.category && l.category.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
            <PlusCircle className="w-3 h-3" />
            เพิ่มรายการ
          </span>
        );
      case 'UPDATE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/80 text-blue-300 border border-blue-700/50">
            <FileEdit className="w-3 h-3" />
            แก้ไขข้อมูล
          </span>
        );
      case 'DELETE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/80 text-red-300 border border-red-700/50">
            <Trash2 className="w-3 h-3" />
            ลบรายการ
          </span>
        );
      case 'IMPORT_EXCEL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-700/50">
            <Upload className="w-3 h-3" />
            อัปโหลดไฟล์
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className={`relative w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden my-8 border transition-colors animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] ${
        isDarkMode 
          ? 'bg-[#1e293b] border-slate-700 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 transition-colors ${
          isDarkMode 
            ? 'bg-[#0f172a] border-slate-700 text-slate-100' 
            : 'bg-[#0f243c] border-blue-900/60 text-white'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-600/40">
                  Audit Trail
                </span>
                <span className="text-xs text-blue-200/80">บันทึกประวัติการเปลี่ยนแปลงตามระเบียบสารบรรณ</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                ประวัติการแก้ไขข้อมูล (Audit Log System)
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

        {/* Toolbar & Filters */}
        <div className={`border-b px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 transition-colors ${
          isDarkMode ? 'bg-[#0f172a]/70 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาเจ้าหน้าที่, เลขตำแหน่ง, ชื่อกำลังพล..."
                className={`w-full pl-8 pr-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-blue-500 ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' 
                    : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 shadow-2xs'
                }`}
              />
            </div>

            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className={`border text-xs rounded-lg px-2.5 py-1.5 focus:outline-none ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-700 text-slate-300' 
                  : 'bg-white border-slate-300 text-slate-700 shadow-2xs'
              }`}
            >
              <option value="ALL">การกระทำทั้งหมด</option>
              <option value="CREATE">เพิ่มรายการใหม่</option>
              <option value="UPDATE">แก้ไขข้อมูล</option>
              <option value="DELETE">ลบรายการ</option>
              <option value="IMPORT_EXCEL">อัปโหลดไฟล์</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAuditLogs}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-emerald-400 hover:text-emerald-300' 
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-emerald-700 shadow-2xs'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>ส่งออก Log (.csv)</span>
            </button>

            <button
              onClick={handleClearLogs}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-red-950/60 border-slate-700 text-slate-400 hover:text-red-400' 
                  : 'bg-white hover:bg-red-50 border-slate-300 text-slate-500 hover:text-red-600 shadow-2xs'
              }`}
              title="ล้างประวัติทั้งหมด"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Audit Log Entries List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredLogs.length === 0 ? (
            <div className={`py-12 text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <History className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs">ยังไม่มีบันทึกประวัติการเปลี่ยนแปลง หรือไม่พบข้อมูลตามตัวกรอง</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`border rounded-xl p-3.5 text-xs transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-200' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800 shadow-2xs'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getActionBadge(log.action)}
                    <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {log.positionNumber ? `เลขตำแหน่ง ${log.positionNumber}` : log.category}
                    </span>
                    {log.targetPerson && (
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                        ({log.targetPerson})
                      </span>
                    )}
                  </div>

                  <div className={`flex items-center gap-3 text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {log.timestamp}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-blue-600 dark:text-blue-300">
                      <UserCheck className="w-3 h-3 text-blue-500" />
                      {log.officerName}
                    </span>
                  </div>
                </div>

                {log.details && (
                  <p className={`text-[11px] mb-2 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {log.details}
                  </p>
                )}

                {/* Old Value vs New Value Diff */}
                {(log.oldValue || log.newValue) && (
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t p-2 rounded-lg font-mono text-[11px] ${
                    isDarkMode 
                      ? 'border-slate-800/60 bg-slate-900/50' 
                      : 'border-slate-200 bg-white shadow-2xs'
                  }`}>
                    <div>
                      <span className="text-red-500 block font-sans font-bold text-[10px] mb-0.5">
                        [ค่าก่อนแก้ไข (Old Value)]:
                      </span>
                      <span className="text-red-600 dark:text-red-300/80 break-words">{log.oldValue || '-'}</span>
                    </div>

                    <div>
                      <span className="text-emerald-600 dark:text-emerald-400 block font-sans font-bold text-[10px] mb-0.5">
                        [ค่าหลังแก้ไข (New Value)]:
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-300 break-words">{log.newValue || '-'}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className={`border-t px-6 py-3 flex items-center justify-between text-xs shrink-0 transition-colors ${
          isDarkMode ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <span>รวมทั้งหมด {filteredLogs.length} รายการบันทึก</span>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 shadow-2xs'
            }`}
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
