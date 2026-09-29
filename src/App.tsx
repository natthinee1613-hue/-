import React, { useState, useEffect, useMemo } from 'react';
import { 
  PoliceCategory, 
  PolicePositionRecord, 
  FilterState, 
  StatusFilterType,
  POLICE_CATEGORIES 
} from './types/police';
import { INITIAL_POLICE_RECORDS } from './data/initialData';
import { 
  recordRecordCreation, 
  recordRecordUpdate, 
  recordRecordDeletion, 
  saveAuditLog, 
  getCurrentOfficerName 
} from './utils/auditLogger';
import { exportToExcel, downloadTemplate, exportToCsv } from './utils/excelHelper';
import { getStatusBadge } from './utils/formatters';

import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { CategoryTabs } from './components/CategoryTabs';
import { FilterBar } from './components/FilterBar';
import { DataTable } from './components/DataTable';
import { RecordModal } from './components/RecordModal';
import { DetailModal } from './components/DetailModal';
import { UploadModal } from './components/UploadModal';
import { AuditLogModal } from './components/AuditLogModal';
import { PrintReportModal } from './components/PrintReportModal';
import { VeoVideoModal } from './components/VeoVideoModal';
import { WebPublishModal } from './components/WebPublishModal';
import { 
  fetchServerRecords, 
  publishRecordsToWeb, 
  resetServerRecords, 
  clearBrowserCache,
  STORAGE_KEY,
  LOCAL_VERSION_KEY,
  LAST_PUBLISHED_KEY
} from './utils/dataSync';

const THEME_KEY = 'police_position_theme_mode';

export default function App() {
  // Theme state: default to Clean Light Mode as recommended
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem(THEME_KEY);
    return saved !== null ? saved === 'dark' : false;
  });

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
      return next;
    });
  };

  // Master records state
  const [records, setRecords] = useState<PolicePositionRecord[]>(() => {
    if (typeof window === 'undefined') return INITIAL_POLICE_RECORDS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load records from storage', e);
    }
    return INITIAL_POLICE_RECORDS;
  });

  // Current selected category tab
  const [selectedCategory, setSelectedCategory] = useState<PoliceCategory | 'ALL'>('ให้ออกจากราชการไว้ก่อน');

  // Filter state
  const [filter, setFilter] = useState<FilterState>({
    search: '',
    category: 'ให้ออกจากราชการไว้ก่อน',
    bureau: '',
    division: '',
    duty: '',
    quickDuty: 'ALL',
    status: 'ALL',
  });

  // Security / Masking
  const [isIdMasked, setIsIdMasked] = useState<boolean>(true);

  // Selected row IDs for batch actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PolicePositionRecord | null>(null);
  const [selectedDetailRecord, setSelectedDetailRecord] = useState<PolicePositionRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isVeoModalOpen, setIsVeoModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Server Web Sync State
  const [serverVersion, setServerVersion] = useState<number>(1);
  const [serverLastPublishedAt, setServerLastPublishedAt] = useState<string | null>(null);
  const [serverLastPublishedBy, setServerLastPublishedBy] = useState<string | null>(null);
  const [serverTotalRecords, setServerTotalRecords] = useState<number>(INITIAL_POLICE_RECORDS.length);
  const [lastSyncedJson, setLastSyncedJson] = useState<string>('');

  // Fetch fresh published records from server on mount
  useEffect(() => {
    let isMounted = true;
    async function loadInitialServerData() {
      try {
        const serverData = await fetchServerRecords();
        if (serverData && isMounted && Array.isArray(serverData.records) && serverData.records.length > 0) {
          setRecords(serverData.records);
          setServerVersion(serverData.version);
          setServerLastPublishedAt(serverData.lastPublishedAt);
          setServerLastPublishedBy(serverData.lastPublishedBy || null);
          setServerTotalRecords(serverData.totalRecords);
          setLastSyncedJson(JSON.stringify(serverData.records));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData.records));
          localStorage.setItem(LOCAL_VERSION_KEY, String(serverData.version));
          localStorage.setItem(LAST_PUBLISHED_KEY, serverData.lastPublishedAt);
        } else if (isMounted) {
          setLastSyncedJson(JSON.stringify(records));
        }
      } catch (err) {
        console.error('Failed to load server data on startup:', err);
      }
    }
    loadInitialServerData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Track if there are unpublished changes compared to server
  const hasUnpublishedChanges = useMemo(() => {
    if (!lastSyncedJson) return false;
    return JSON.stringify(records) !== lastSyncedJson;
  }, [records, lastSyncedJson]);

  // Officer name
  const [officerName, setOfficerName] = useState(getCurrentOfficerName());

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Deleted records backup for Undo
  const [lastDeletedRecords, setLastDeletedRecords] = useState<PolicePositionRecord[] | null>(null);

  const showToast = (msg: string, undoable = false) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const handleUndoDelete = () => {
    if (lastDeletedRecords && lastDeletedRecords.length > 0) {
      setRecords((prev) => [...lastDeletedRecords, ...prev]);
      saveAuditLog({
        officerName,
        action: 'CREATE',
        category: lastDeletedRecords[0]?.category || 'ให้ออกจากราชการไว้ก่อน',
        fieldChanged: 'ยกเลิกการลบ (Undo Restore)',
        newValue: `กู้คืน ${lastDeletedRecords.length} รายการ`,
        details: `กู้คืนข้อมูลที่เพิ่งลบ ${lastDeletedRecords.length} รายการ สำเร็จ`
      });
      setLastDeletedRecords(null);
      setToastMessage(`กู้คืน ${lastDeletedRecords.length} รายการ เรียบร้อยแล้ว`);
    }
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save records to localStorage', e);
    }
  }, [records]);

  // Synchronize category selection with filter
  const handleSelectCategory = (cat: PoliceCategory | 'ALL') => {
    setSelectedCategory(cat);
    setFilter((prev) => ({
      ...prev,
      category: cat,
    }));
    setSelectedIds([]);
  };

  // Filter options derived from data
  const availableBureaus = useMemo(() => {
    const list = Array.from(new Set(records.map((r) => r.bureau).filter(Boolean)));
    return list.sort();
  }, [records]);

  const availableDivisions = useMemo(() => {
    const subset = filter.bureau ? records.filter((r) => r.bureau === filter.bureau) : records;
    const list = Array.from(new Set(subset.map((r) => r.division).filter(Boolean)));
    return list.sort();
  }, [records, filter.bureau]);

  const availableDuties = useMemo(() => {
    const list = Array.from(new Set(records.map((r) => r.duty).filter(Boolean)));
    return list.sort();
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // 1. Category Filter
      if (filter.category !== 'ALL' && rec.category !== filter.category) {
        return false;
      }

      // 2. Bureau Filter
      if (filter.bureau && rec.bureau !== filter.bureau) {
        return false;
      }

      // 3. Division Filter
      if (filter.division && rec.division !== filter.division) {
        return false;
      }

      // 4. Duty Filter (Dropdown)
      if (filter.duty && rec.duty !== filter.duty) {
        return false;
      }

      // 5. Quick Duty Filter (Pills: ป., สส., จร., อก.)
      if (filter.quickDuty !== 'ALL') {
        const qd = filter.quickDuty;
        const dutyCombined = `${rec.duty} ${rec.lineOfWork} ${rec.workGroup}`.toLowerCase();
        if (qd === 'ป.') {
          if (!dutyCombined.includes('ป้องกัน') && !dutyCombined.includes('ป.')) return false;
        } else if (qd === 'สส.') {
          if (!dutyCombined.includes('สืบสวน') && !dutyCombined.includes('สส.')) return false;
        } else if (qd === 'จร.') {
          if (!dutyCombined.includes('จราจร') && !dutyCombined.includes('จร.')) return false;
        } else if (qd === 'อก.') {
          if (!dutyCombined.includes('ธุรการ') && !dutyCombined.includes('อำนวยการ') && !dutyCombined.includes('อก.')) return false;
        }
      }

      // 6. Status Filter (Clickable from KPI cards or Dropdown)
      if (filter.status !== 'ALL') {
        const badge = getStatusBadge(rec);
        if (filter.status === 'SECRET') {
          if (!rec.notes.includes('ลับ')) return false;
        } else if (badge.type !== filter.status) {
          return false;
        }
      }

      // 7. Search query (POS CODE, person name, docBookNumber, unit, etc.)
      if (filter.search.trim()) {
        const q = filter.search.toLowerCase().trim();
        const searchPool = [
          rec.positionNumber,
          rec.positionRank,
          rec.positionName,
          rec.personRankName,
          rec.idCard,
          rec.reservationNoDate,
          rec.docBookNumber,
          rec.docOriginUnit,
          rec.division,
          rec.bureau,
          rec.duty,
          rec.appointmentOrder,
          rec.notes,
          rec.resolutionNo,
          rec.transferredRankOrPosition,
        ].map((v) => String(v || '').toLowerCase());

        const matches = searchPool.some((val) => val.includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [records, filter]);

  // Record CRUD Handlers
  const handleSaveRecord = (recordToSave: PolicePositionRecord) => {
    const exists = records.some((r) => r.id === recordToSave.id);
    if (exists) {
      const oldRec = records.find((r) => r.id === recordToSave.id)!;
      setRecords((prev) =>
        prev.map((r) => (r.id === recordToSave.id ? recordToSave : r))
      );
      recordRecordUpdate(oldRec, recordToSave, officerName);
      showToast(`บันทึกการแก้ไขตำแหน่ง "${recordToSave.positionNumber || recordToSave.positionName}" เรียบร้อยแล้ว`);
    } else {
      const newRec = {
        ...recordToSave,
        id: recordToSave.id || `rec-${Date.now()}`,
        orderNo: records.filter((r) => r.category === recordToSave.category).length + 1,
      };
      setRecords((prev) => [newRec, ...prev]);
      recordRecordCreation(newRec, officerName);
      showToast(`เพิ่มรายการกันตำแหน่งหมวด "${newRec.category}" สำเร็จ`);
    }
  };

  const handleDeleteRecord = (record: PolicePositionRecord) => {
    // Delete immediately without popup blocking
    setRecords((prev) => prev.filter((r) => r.id !== record.id));
    setSelectedIds((prev) => prev.filter((id) => id !== record.id));
    setLastDeletedRecords([record]);
    recordRecordDeletion(record, officerName);
    showToast(`ลบบรรทัด "${record.positionNumber || record.personRankName || 'รายการที่เลือก'}" เรียบร้อยแล้ว`, true);
  };

  const handleDuplicateRecord = (record: PolicePositionRecord) => {
    const duplicated: PolicePositionRecord = {
      ...record,
      id: `copy-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      orderNo: records.filter((r) => r.category === record.category).length + 1,
      positionNumber: record.positionNumber ? `${record.positionNumber} (คัดลอก)` : '',
      personRankName: '',
      idCard: '',
      appointmentOrder: '',
      appointmentEffectiveDate: '',
      updatedAt: new Date().toISOString(),
      updatedBy: officerName,
    };
    setRecords((prev) => [duplicated, ...prev]);
    recordRecordCreation(duplicated, officerName);
    showToast(`คัดลอกตำแหน่ง "${record.positionNumber}" เป็นรายการใหม่สำเร็จ`);
  };

  const handleSaveInlineEdit = (recordId: string, updatedFields: Partial<PolicePositionRecord>) => {
    const oldRec = records.find((r) => r.id === recordId);
    if (!oldRec) return;

    const newRec = {
      ...oldRec,
      ...updatedFields,
      updatedAt: new Date().toISOString(),
      updatedBy: officerName,
    };

    setRecords((prev) => prev.map((r) => (r.id === recordId ? newRec : r)));
    recordRecordUpdate(oldRec, newRec, officerName);
    showToast(`อัปเดตข้อมูลด่วนสำเร็จ (ตำแหน่ง ${newRec.positionNumber})`);
  };

  // Open Detail Modal
  const handleViewDetail = (record: PolicePositionRecord) => {
    setSelectedDetailRecord(record);
    setIsDetailModalOpen(true);
  };

  // Batch Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length && filteredRecords.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map((r) => r.id));
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    const toDelete = records.filter((r) => selectedIds.includes(r.id));
    
    // Delete immediately
    setRecords((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    setLastDeletedRecords(toDelete);
    
    saveAuditLog({
      officerName,
      action: 'BATCH_DELETE',
      category: selectedCategory === 'ALL' ? 'ให้ออกจากราชการไว้ก่อน' : selectedCategory,
      fieldChanged: 'ลบข้อมูลที่เลือก',
      oldValue: `ลบจำนวน ${toDelete.length} รายการ`,
      newValue: '(ลบแล้ว)',
      details: `ลบรายการที่เลือกจำนวน ${toDelete.length} รายการ โดย ${officerName}`
    });

    setSelectedIds([]);
    showToast(`ลบบรรทัดที่เลือก ${toDelete.length} รายการ เรียบร้อยแล้ว`, true);
  };

  const handleBatchExport = () => {
    const toExport = records.filter((r) => selectedIds.includes(r.id));
    if (toExport.length === 0) return;
    exportToCsv(toExport, `ส่งออกรายการที่เลือก_${selectedIds.length}_รายการ.csv`);
    showToast(`ส่งออกข้อมูล ${selectedIds.length} รายการ เรียบร้อยแล้ว`);
  };

  // Upload handler
  const handleImportSuccess = (
    newRecords: PolicePositionRecord[],
    mode: 'APPEND' | 'REPLACE_MATCHING' | 'REPLACE_ALL',
    summaryMessage: string
  ) => {
    if (mode === 'REPLACE_ALL') {
      setRecords(newRecords);
    } else if (mode === 'REPLACE_MATCHING') {
      const importedCategories = Array.from(new Set(newRecords.map((r) => r.category)));
      setRecords((prev) => [
        ...prev.filter((r) => !importedCategories.includes(r.category)),
        ...newRecords,
      ]);
    } else {
      // APPEND
      setRecords((prev) => [...prev, ...newRecords]);
    }

    saveAuditLog({
      officerName,
      action: 'IMPORT_EXCEL',
      category: newRecords[0]?.category || 'ให้ออกจากราชการไว้ก่อน',
      fieldChanged: 'นำเข้าข้อมูลไฟล์',
      newValue: `นำเข้า ${newRecords.length} รายการ (โหมด: ${mode})`,
      details: summaryMessage
    });

    showToast(summaryMessage);
  };

  // Web Publishing Handler
  const handlePublishToWeb = async (note?: string): Promise<boolean> => {
    const res = await publishRecordsToWeb(records, officerName, note);
    if (res.success) {
      if (res.version) setServerVersion(res.version);
      if (res.lastPublishedAt) setServerLastPublishedAt(res.lastPublishedAt);
      setServerLastPublishedBy(officerName);
      setServerTotalRecords(records.length);
      setLastSyncedJson(JSON.stringify(records));

      saveAuditLog({
        officerName,
        action: 'PUBLISH_TO_WEB',
        category: 'ALL',
        fieldChanged: 'เผยแพร่ข้อมูลลงเว็ป',
        newValue: `เวอร์ชัน ${res.version} (${records.length} รายการ)`,
        details: note || `เผยแพร่ข้อมูลทำเนียบกำลังพลลงเว็ปสำเร็จ (${records.length} รายการ)`
      });

      showToast(`🚀 เผยแพร่อัปเดตข้อมูลตารางลงเว็ปสำเร็จ (เวอร์ชัน ${res.version}) ข้อมูลพร้อมใช้งานทันที`);
      return true;
    } else {
      showToast(res.error || 'การเผยแพร่ข้อมูลลงเว็ปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      return false;
    }
  };

  // Pull latest records from web server
  const handlePullFromServer = async (): Promise<boolean> => {
    const data = await fetchServerRecords();
    if (data && Array.isArray(data.records)) {
      setRecords(data.records);
      setServerVersion(data.version);
      setServerLastPublishedAt(data.lastPublishedAt);
      setServerLastPublishedBy(data.lastPublishedBy || null);
      setServerTotalRecords(data.totalRecords);
      setLastSyncedJson(JSON.stringify(data.records));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.records));
      showToast(`ดึงข้อมูลล่าสุดจากเว็ปสำเร็จ (${data.records.length} ตำแหน่ง)`);
      return true;
    }
    return false;
  };

  // Clear local browser cache and reload fresh data from web server
  const handleClearCacheAndReload = async () => {
    clearBrowserCache();
    const data = await fetchServerRecords();
    if (data && Array.isArray(data.records)) {
      setRecords(data.records);
      setServerVersion(data.version);
      setServerLastPublishedAt(data.lastPublishedAt);
      setServerLastPublishedBy(data.lastPublishedBy || null);
      setServerTotalRecords(data.totalRecords);
      setLastSyncedJson(JSON.stringify(data.records));
      showToast('ล้างแคชเครื่องและโหลดข้อมูลล่าสุดจากเว็ปสำเร็จ');
    } else {
      setRecords(INITIAL_POLICE_RECORDS);
      setLastSyncedJson(JSON.stringify(INITIAL_POLICE_RECORDS));
      showToast('ล้างแคชเครื่องและคืนค่าข้อมูลเริ่มต้นสำเร็จ');
    }
  };

  // Import JSON Database Backup
  const handleImportBackup = (backupRecords: PolicePositionRecord[]) => {
    setRecords(backupRecords);
    showToast(`นำเข้าไฟล์สำรองข้อมูล ${backupRecords.length} รายการ เรียบร้อยแล้ว (อย่าลืมกด "เผยแพร่ลงเว็ป" เพื่อบันทึกลงระบบ)`);
  };

  // Reset to original seed data
  const handleResetData = async () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นชุดเริ่มต้น 54 รายการและข้อมูลตัวอย่าง 13 หมวด หรือไม่? (ข้อมูลบนเว็ปและเครื่องจะถูกรีเซ็ต)')) {
      const resetResult = await resetServerRecords();
      const freshRecords = resetResult || INITIAL_POLICE_RECORDS;
      setRecords(freshRecords);
      setSelectedIds([]);
      setServerVersion(1);
      setServerTotalRecords(freshRecords.length);
      setLastSyncedJson(JSON.stringify(freshRecords));
      saveAuditLog({
        officerName,
        action: 'RESET_DATA',
        category: 'ALL',
        fieldChanged: 'รีเซ็ตข้อมูลเริ่มต้น',
        details: 'รีเซ็ตข้อมูลทั้งหมดเป็นค่าเริ่มต้น 54 รายการ'
      });
      showToast('รีเซ็ตข้อมูลตั้งต้น 54 รายการ เรียบร้อยแล้ว');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-['Sarabun'] transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Toast Notification with Undo */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 ${
          isDarkMode 
            ? 'bg-[#1e293b] text-white border-slate-700' 
            : 'bg-white text-slate-900 border-slate-200 shadow-slate-300/50'
        }`}>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs sm:text-sm font-semibold font-['Sarabun']">{toastMessage}</span>
          
          {lastDeletedRecords && lastDeletedRecords.length > 0 && (
            <button
              onClick={handleUndoDelete}
              className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm ml-1 cursor-pointer"
            >
              เลิกทำ (Undo)
            </button>
          )}

          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 text-xs ml-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Grand Royal Thai Police Cover Banner with Theme Toggle */}
      <Header
        onOpenAddModal={() => {
          setEditingRecord(null);
          setIsAddModalOpen(true);
        }}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onOpenVeoModal={() => setIsVeoModalOpen(true)}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
        hasUnpublishedChanges={hasUnpublishedChanges}
        serverVersion={serverVersion}
        serverLastPublishedAt={serverLastPublishedAt}
        onExportExcel={() => exportToExcel(records, selectedCategory)}
        onDownloadTemplate={downloadTemplate}
        onResetData={handleResetData}
        currentCategory={selectedCategory}
        totalRecords={records.length}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* 2. Main Dashboard Body */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-2 sm:px-4 lg:px-6 py-3 space-y-2.5">
        
        {/* [สลับขึ้นข้างบนตามคำขอ] ภาพรวมอัตรากำลังพล (คลิกการ์ดเพื่อกรอง) */}
        <KpiCards
          records={records.filter(r => selectedCategory === 'ALL' ? true : r.category === selectedCategory)}
          currentCategory={selectedCategory}
          activeStatusFilter={filter.status}
          onSelectStatusFilter={(st) => setFilter(prev => ({ ...prev, status: st }))}
          isDarkMode={isDarkMode}
        />

        {/* [สลับลงมา] เมนู แสดงทั้งหมด และ ๑๓ กลุ่มกรณีการกันตำแหน่ง (CategoryTabs) */}
        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          records={records}
          isDarkMode={isDarkMode}
        />

        {/* Smart Filter & Action Bar (with quick duty pills ป./สส./จร./อก.) */}
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          isIdMasked={isIdMasked}
          onToggleMaskId={() => setIsIdMasked((prev) => !prev)}
          availableBureaus={availableBureaus}
          availableDivisions={availableDivisions}
          availableDuties={availableDuties}
          totalFiltered={filteredRecords.length}
          totalRecords={records.length}
          selectedIds={selectedIds}
          onBatchDelete={handleBatchDelete}
          onBatchExport={handleBatchExport}
          onClearSelection={() => setSelectedIds([])}
          isDarkMode={isDarkMode}
        />

        {/* Master Data Table (High readability & Monospace POS CODE box) */}
        <DataTable
          records={filteredRecords}
          isIdMasked={isIdMasked}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onEditRecord={(record) => {
            setEditingRecord(record);
            setIsAddModalOpen(true);
          }}
          onDeleteRecord={handleDeleteRecord}
          onDuplicateRecord={handleDuplicateRecord}
          onSaveInlineEdit={handleSaveInlineEdit}
          onBatchDelete={handleBatchDelete}
          onClearSelection={() => setSelectedIds([])}
          onViewDetail={handleViewDetail}
          isDarkMode={isDarkMode}
        />

      </main>

      {/* 4. Footer */}
      <footer className={`border-t py-4 px-4 text-center text-xs no-print transition-colors ${
        isDarkMode ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-['Sarabun'] text-xs">
          <span className="flex items-center gap-1.5 justify-center">
            <span>ระบบฐานข้อมูลทำเนียบกำลังพลและการกันตำแหน่งในแต่ละกรณี ข้าราชการตำรวจชั้นประทวน (งานประทวน 1) © ๒๕๖๙</span>
          </span>
          <span className="text-xs text-slate-400">
            ฝ่ายควบคุมอัตรากำลัง อต. กองอัตรากำลังพล สำนักงานกำลังพล สำนักงานตำรวจแห่งชาติ (๑๓ กลุ่มกรณี)
          </span>
        </div>
      </footer>

      {/* Modal: Add / Edit Record */}
      <RecordModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        initialRecord={editingRecord}
        defaultCategory={selectedCategory === 'ALL' ? 'ให้ออกจากราชการไว้ก่อน' : selectedCategory}
        officerName={officerName}
        isDarkMode={isDarkMode}
      />

      {/* Modal: Comparative Detail View (Detail Modal) */}
      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDetailRecord(null);
        }}
        record={selectedDetailRecord}
        isIdMasked={isIdMasked}
        onOpenEdit={(rec) => {
          setIsDetailModalOpen(false);
          setEditingRecord(rec);
          setIsAddModalOpen(true);
        }}
        isDarkMode={isDarkMode}
      />

      {/* Modal: Upload Excel / CSV / Multi-sheet */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImportSuccess={handleImportSuccess}
        currentCategory={selectedCategory}
        officerName={officerName}
        isDarkMode={isDarkMode}
      />

      {/* Modal: Audit Log Trail */}
      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Modal: Printable Official Saraban Report */}
      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        records={records}
        currentCategory={selectedCategory}
        officerName={officerName}
        isDarkMode={isDarkMode}
      />

      {/* Modal: AI Veo 3 Video Generator (Text to Video & Image to Video) */}
      <VeoVideoModal
        isOpen={isVeoModalOpen}
        onClose={() => setIsVeoModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Modal: Web Publish & Sync Management */}
      <WebPublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        records={records}
        officerName={officerName}
        isDarkMode={isDarkMode}
        serverVersion={serverVersion}
        serverLastPublishedAt={serverLastPublishedAt}
        serverLastPublishedBy={serverLastPublishedBy}
        serverTotalRecords={serverTotalRecords}
        hasUnpublishedChanges={hasUnpublishedChanges}
        onPublishToWeb={handlePublishToWeb}
        onPullFromServer={handlePullFromServer}
        onClearCacheAndReload={handleClearCacheAndReload}
        onResetData={handleResetData}
        onImportBackup={handleImportBackup}
      />

    </div>
  );
}
