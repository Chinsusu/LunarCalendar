"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar, Plus } from "lucide-react";
import { DayHero } from "@/components/DayHero";
import { DayInfoCard } from "@/components/DayInfoCard";
import { NotesSection } from "@/components/NotesSection";
import { LunarDatePicker } from "@/components/LunarDatePicker";
import { useLunarDate } from "@/hooks/useLunarDate";
import { lunarToSolar } from "@/lib/lunar";
import { toISODate } from "@/lib/utils";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { lunar, canChi, hoangDaoHours, isHoangDao } = useLunarDate(selectedDate);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-primary font-display text-2xl animate-pulse">Lịch Âm Việt</div>
      </div>
    );
  }

  const isToday = toISODate(selectedDate) === toISODate(new Date());

  return (
    <div>
      {/* AppBar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-vn sticky top-0 z-20 bg-card-vn">
        <h1 className="font-display font-bold text-lg text-primary tracking-wide">LỊCH ÂM VIỆT</h1>
        <div className="flex items-center gap-2">
          {!isToday && (
            <button
              onClick={() => setSelectedDate(new Date())}
              className="text-xs px-3 py-1 rounded border border-vn text-primary font-semibold cursor-pointer hover:bg-black/5 transition-colors"
            >
              Hôm nay
            </button>
          )}
          <button
            onClick={() => setShowPicker(true)}
            className="cursor-pointer p-1 hover:bg-black/5 rounded transition-colors"
            aria-label="Chọn ngày âm lịch"
          >
            <Calendar size={22} strokeWidth={1.5} color="var(--color-primary)" />
          </button>
        </div>
      </header>

      {/* DayHero */}
      <DayHero date={selectedDate} onDateChange={setSelectedDate} />

      {/* DayInfoCard */}
      <DayInfoCard
        canChi={canChi}
        hoangDaoHours={hoangDaoHours}
        isHoangDao={isHoangDao}
      />

      {/* Notes */}
      <NotesSection date={selectedDate} />

      {/* FAB */}
      <button
        onClick={() => setShowPicker(true)}
        className="fixed right-4 cursor-pointer w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 z-30"
        style={{ bottom: 76, background: "var(--color-primary)" }}
        aria-label="Chọn ngày"
      >
        <Plus size={24} color="#FFF8F0" strokeWidth={2} />
      </button>

      {/* LunarDatePicker */}
      {showPicker && (
        <LunarDatePicker
          initialYear={lunar.year}
          initialMonth={lunar.month}
          initialDay={lunar.day}
          onConfirm={(y, m, d, leap) => {
            const solar = lunarToSolar(d, m, y, leap);
            setSelectedDate(solar);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
