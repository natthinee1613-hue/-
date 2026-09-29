import React, { useRef } from 'react';
import { PolicePositionRecord, POLICE_CATEGORIES } from '../types/police';
import { Printer, X, Download, Shield } from 'lucide-react';
import { getThaiDateTimeNow, formatPositionNumber } from '../utils/formatters';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: PolicePositionRecord[];
  currentCategory: string;
  officerName: string;
  isDarkMode?: boolean;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  records,
  currentCategory,
  officerName,
  isDarkMode = false,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Group counts by category
  const countByCategory: Record<string, number> = {};
  POLICE_CATEGORIES.forEach((cat) => {
    countByCategory[cat] = records.filter((r) => r.category === cat).length;
  });

  const displayedRecords =
    currentCategory === 'ALL'
      ? records.slice(0, 100) // first 100 in print for elegance
      : records.filter((r) => r.category === currentCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className={`relative w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden my-6 flex flex-col max-h-[92vh] border transition-colors ${
        isDarkMode ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200'
      }`}>
        
        {/* Modal Controls Header (Not printed) */}
        <div className={`px-6 py-3.5 border-b flex items-center justify-between no-print shrink-0 transition-colors ${
          isDarkMode ? 'bg-[#0f172a] border-slate-700 text-white' : 'bg-[#0f243c] border-blue-900/60 text-white'
        }`}>
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-300" />
            <h3 className="text-sm font-bold text-white">
              พิมพ์รายงานสารบรรณเสนอผู้บังคับบัญชา (Official Saraban Report)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์เอกสาร (Print / PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div
          ref={printAreaRef}
          className="p-8 sm:p-12 overflow-y-auto bg-white text-black font-sans text-xs flex-1 selection:bg-blue-200"
          style={{ fontFamily: "'Sarabun', 'Prompt', sans-serif" }}
        >
          {/* Memorandum Header (บันทึกข้อความ) */}
          <div className="border-b-2 border-black pb-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 flex items-center justify-center border-2 border-black rounded-full text-center">
                <span className="font-bold text-sm">ตร.</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-center flex-1">
                บันทึกข้อความ
              </h1>
              <div className="w-16 text-right font-mono text-[10px] text-gray-600">
                แบบ สร.1
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mt-3 leading-relaxed">
              <div>
                <p>
                  <strong>ส่วนราชการ:</strong> กองอัตรากำลังพล สำนักงานกำลังพล สำนักงานตำรวจแห่งชาติ โทร. ๐-๒๒๐๕-๒๗๕๓
                </p>
                <p className="mt-1">
                  <strong>ที่:</strong> ตร ๐๐๐๖.๒/พิเศษ
                </p>
              </div>
              <div className="text-right">
                <p>
                  <strong>วันที่:</strong> {getThaiDateTimeNow()}
                </p>
                <p className="mt-1">
                  <strong>ชั้นความลับ:</strong> ปกติ / (ลับเฉพาะราย)
                </p>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-300">
              <p>
                <strong>เรื่อง:</strong> รายงานสรุปสถานะการกันตำแหน่งข้าราชการตำรวจชั้นประทวน (๑๓ กลุ่มกรณี) ประจำปีงบประมาณ
              </p>
              <p className="mt-1">
                <strong>เรียน:</strong> ผู้บัญชาการสำนักงานกำลังพล (ผ่าน ผู้บังคับการกองอัตรากำลังพล)
              </p>
            </div>
          </div>

          {/* Body Paragraph */}
          <div className="text-xs leading-relaxed space-y-3 mb-6 indent-8">
            <p>
              ตามที่สำนักงานตำรวจแห่งชาติ ได้มีนโยบายและมาตรการบริหารจัดการอัตรากำลังพลข้าราชการตำรวจชั้นประทวน เพื่อให้สอดคล้องกับระเบียบ ก.ตร. ว่าด้วยการกันตำแหน่งรองรับกรณีต่างๆ ทั้ง ๑๓ กลุ่มกรณี ได้แก่ การให้ออกจากราชการไว้ก่อน, การกันตำแหน่ง รร.นรต., การสั่งพักราชการ, การกลับเข้ารับราชการ, การรับโอนเข้า, การตัดโอน, การลาเพื่อสมัครรับเลือกตั้ง, การบรรจุทายาทผู้ปฏิบัติหน้าที่เสียชีวิต, นักกีฬาทีมชาติ, ผู้มีคุณวุฒิพิเศษตามนโยบาย, การเปิดสอบแข่งขัน, โควตานักเรียนนายสิบตำรวจ (นสต.), และตำแหน่งที่ยุบเลิกตามมติ ก.ตร. นั้น
            </p>
            <p>
              ฝ่ายควบคุมอัตรากำลัง อต. ได้ดำเนินการรวบรวมและตรวจสอบความถูกต้องของบัญชีกันตำแหน่งข้าราชการตำรวจชั้นประทวน จึงขอรายงานสรุปผลการสงวนและบรรจุอัตรากำลังพล ดังมีรายละเอียดปรากฏตามตารางต่อไปนี้:
            </p>
          </div>

          {/* Table 1: Summary by 13 Categories */}
          <div className="mb-6">
            <h4 className="font-bold text-xs mb-2">
              ตารางที่ ๑ : สรุปยอดรวมจำนวนตำแหน่งที่กันไว้จำแนกราย ๑๓ หมวดหมู่
            </h4>
            <table className="w-full border-collapse border border-black text-[11px]">
              <thead>
                <tr className="bg-gray-100 text-center font-bold">
                  <th className="border border-black p-1.5 w-12">ลำดับ</th>
                  <th className="border border-black p-1.5 text-left">หมวดการกันตำแหน่ง (๑๓ กลุ่มกรณี)</th>
                  <th className="border border-black p-1.5 w-28 text-center">สงวนตำแหน่ง (อัตรา)</th>
                  <th className="border border-black p-1.5 w-28 text-center">มีคำสั่งบรรจุแล้ว</th>
                  <th className="border border-black p-1.5 w-28 text-center">ไล่ออก/ให้ออก</th>
                  <th className="border border-black p-1.5 text-left">หมายเหตุ / ความคืบหน้า</th>
                </tr>
              </thead>
              <tbody>
                {POLICE_CATEGORIES.map((cat, idx) => {
                  const catRecs = records.filter((r) => r.category === cat);
                  const appCount = catRecs.filter((r) => r.appointmentOrder).length;
                  const disCount = catRecs.filter((r) => r.notes.includes('ไล่ออก')).length;

                  return (
                    <tr key={cat} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                      <td className="border border-black p-1.5 font-medium">{cat}</td>
                      <td className="border border-black p-1.5 text-center font-bold">{catRecs.length}</td>
                      <td className="border border-black p-1.5 text-center">{appCount}</td>
                      <td className="border border-black p-1.5 text-center">{disCount}</td>
                      <td className="border border-black p-1.5 text-gray-600">
                        {catRecs.length > 0 ? 'ข้อมูลเป็นปัจจุบัน' : 'ไม่มีตำแหน่งค้าง'}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-200 font-bold">
                  <td colSpan={2} className="border border-black p-1.5 text-center">
                    รวมทั้งสิ้นทุกหมวด
                  </td>
                  <td className="border border-black p-1.5 text-center">{records.length}</td>
                  <td className="border border-black p-1.5 text-center">
                    {records.filter((r) => r.appointmentOrder).length}
                  </td>
                  <td className="border border-black p-1.5 text-center">
                    {records.filter((r) => r.notes.includes('ไล่ออก')).length}
                  </td>
                  <td className="border border-black p-1.5">ครบถ้วนทุกรายการ</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 2: Detailed List for Current Category */}
          <div className="mb-8">
            <h4 className="font-bold text-xs mb-2">
              ตารางที่ ๒ : รายละเอียดบัญชีรายชื่อตำแหน่ง ({currentCategory === 'ALL' ? 'ทุกหมวดหมู่ (ตัวอย่าง ๑๐๐ รายการแรก)' : currentCategory})
            </h4>
            <table className="w-full border-collapse border border-black text-[10px]">
              <thead>
                <tr className="bg-gray-100 text-center font-bold">
                  <th className="border border-black p-1 w-8">ที่</th>
                  <th className="border border-black p-1">ผ./วันเดือนปี</th>
                  <th className="border border-black p-1">เลขที่หนังสือ</th>
                  <th className="border border-black p-1">เลขตำแหน่ง</th>
                  <th className="border border-black p-1">ระดับ</th>
                  <th className="border border-black p-1 text-left">ตำแหน่ง/สังกัด</th>
                  <th className="border border-black p-1">บช.</th>
                  <th className="border border-black p-1 text-left">ยศ - ชื่อ - สกุล</th>
                  <th className="border border-black p-1 text-left">คำสั่งบรรจุ / ผล</th>
                  <th className="border border-black p-1">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {displayedRecords.map((r, i) => (
                  <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-black p-1 text-center">{i + 1}</td>
                    <td className="border border-black p-1">{r.reservationNoDate || '-'}</td>
                    <td className="border border-black p-1 font-mono">{r.docBookNumber || '-'}</td>
                    <td className="border border-black p-1 font-mono font-bold">{r.positionNumber || '-'}</td>
                    <td className="border border-black p-1 text-center">{r.positionRank || '-'}</td>
                    <td className="border border-black p-1 truncate max-w-[150px]">{r.positionName || '-'}</td>
                    <td className="border border-black p-1 text-center font-bold">{r.bureau || '-'}</td>
                    <td className="border border-black p-1 font-medium">{r.personRankName || '(ว่าง)'}</td>
                    <td className="border border-black p-1 truncate max-w-[120px]">{r.appointmentOrder || '-'}</td>
                    <td className="border border-black p-1 text-center">{r.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Proposal & Sign-off Section */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-400 text-xs">
            <div className="space-y-4">
              <p>จึงเรียนมาเพื่อโปรดทราบและพิจารณาดำเนินการต่อไป</p>
              <div className="pt-6">
                <p className="font-bold">ลงชื่อ..........................................................</p>
                <p className="mt-1">({officerName})</p>
                <p className="text-gray-600">เจ้าหน้าที่ผู้จัดทำรายงานสารบรรณ</p>
                <p className="text-[10px] text-gray-500 mt-1">วันที่ {getThaiDateTimeNow()}</p>
              </div>
            </div>

            <div className="space-y-4 text-right">
              <p>ความเห็นผู้บังคับบัญชา: ทราบ / ดำเนินการตามระเบียบ</p>
              <div className="pt-6">
                <p className="font-bold">ลงชื่อ..........................................................</p>
                <p className="mt-1">(พลตำรวจตรี....................................................)</p>
                <p className="text-gray-600">ผู้บังคับการกองอัตรากำลังพล ตร.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-3 flex items-center justify-between no-print shrink-0">
          <span className="text-xs text-slate-400">
            เอกสารพร้อมจัดพิมพ์ / บันทึกเป็นไฟล์ PDF ตามมาตรฐานงานสารบรรณภาครัฐ
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
            >
              ปิดหน้าต่าง
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์เอกสารนี้</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
