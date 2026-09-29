import React, { useRef } from 'react';
import { PoliceCategory, POLICE_CATEGORIES, PolicePositionRecord } from '../types/police';
import { CATEGORY_CONFIG } from '../utils/formatters';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';

interface CategoryTabsProps {
  selectedCategory: PoliceCategory | 'ALL';
  onSelectCategory: (cat: PoliceCategory | 'ALL') => void;
  records: PolicePositionRecord[];
  isDarkMode: boolean;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  records,
  isDarkMode,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const countByCategory: Record<string, number> = {};
  records.forEach((r) => {
    countByCategory[r.category] = (countByCategory[r.category] || 0) + 1;
  });

  return (
    <div className={`relative rounded-xl border p-2 sm:p-2.5 transition-all font-['Sarabun'] ${
      isDarkMode 
        ? 'bg-slate-900 border-slate-800 text-slate-100' 
        : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
    }`}>
      <div className="flex items-center gap-2">
        {/* Section Label */}
        <div className={`hidden md:flex items-center gap-1.5 shrink-0 pl-1 pr-2 border-r text-xs font-semibold ${
          isDarkMode ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'
        }`}>
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span>หมวดหมู่:</span>
        </div>
        
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className={`p-1 rounded-lg border shrink-0 transition-colors cursor-pointer ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700' 
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
          title="เลื่อนซ้าย"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Horizontal Scrollable Tabs */}
        <div
          ref={scrollRef}
          className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5 px-0.5"
        >
          {/* All Categories Pill (เมนู แสดงทั้งหมด) */}
          <button
            onClick={() => onSelectCategory('ALL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                : isDarkMode
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${selectedCategory === 'ALL' ? 'text-white' : 'text-blue-500'}`} />
            <span>แสดงทั้งหมด</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedCategory === 'ALL'
                  ? 'bg-white/20 text-white'
                  : isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {records.length}
            </span>
          </button>

          {/* Separator */}
          <div className={`h-4 w-px mx-0.5 shrink-0 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

          {/* 13 Official Category Pills */}
          {POLICE_CATEGORIES.map((cat, idx) => {
            const config = CATEGORY_CONFIG[cat];
            const isSelected = selectedCategory === cat;
            const count = countByCategory[cat] || 0;

            return (
              <React.Fragment key={cat}>
                {idx > 0 && (
                  <span className="text-slate-400 select-none text-xs font-light px-0.5">
                    ·
                  </span>
                )}
                <button
                  onClick={() => onSelectCategory(cat)}
                  className={`group relative flex items-center gap-1 px-2.5 py-1 rounded text-xs whitespace-nowrap transition-all border font-semibold cursor-pointer ${
                    config.pillBg
                  } ${config.pillText} ${config.pillBorder} ${
                    isSelected
                      ? 'ring-2 ring-blue-600 shadow-xs scale-[1.02] z-10'
                      : 'hover:brightness-95 opacity-90 hover:opacity-100'
                  }`}
                  title={config.description}
                >
                  <span className={cat === 'ยุบเลิก มติ ก.ตร.' ? 'underline decoration-[#15803d] decoration-[2px] underline-offset-3' : ''}>
                    {config.label}
                  </span>
                  <span
                    className="text-[10px] px-1 py-0.2 rounded font-bold bg-black/10 text-slate-800"
                  >
                    {count}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </button>
              </React.Fragment>
            );
          })}

        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          className={`p-1 rounded-lg border shrink-0 transition-colors cursor-pointer ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700' 
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
          title="เลื่อนขวา"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
