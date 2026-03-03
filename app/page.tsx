"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar } from "lucide-react";
import { DayHero } from "@/components/DayHero";
import { DayInfoCard } from "@/components/DayInfoCard";
import { getCanChi, getHoangDao, solarToLunar } from "@/lib/lunar";
import { toISODate } from "@/lib/utils";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);

  // Tránh hydration mismatch — chỉ render sau khi mount
  useEffect(() => { setMounted(true); }, []);

  const d = selectedDate.getDate();
  const m = selectedDate.getMonth() + 1;
  const y = selectedDate.getFullYear();
  const h = selectedDate.getHours();

  const lunar = useMemo(() => solarToLunar(d, m, y), [d, m, y]);
  const canChi = useMemo(() => getCanChi(d, m, y, h), [d, m, y, h]);
  const hoangDaoHours = useMemo(
    () => getHoangDao(lunar.day, lunar.month, lunar.year),
    [lunar.day, lunar.month, lunar.year]
  );

  // Ngày hiện tại có phải Hoàng Đạo không (dựa vào giờ hiện tại)
  const currentHoangDao = useMemo(() => {
    const currentChi = Math.floor((h + 1) / 2) % 12;
    return hoangDaoHours[currentChi]?.isHoangDao ?? false;
  }, [h, hoangDaoHours]);

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
        <h1 className="font-display font-bold text-lg text-primary tracking-wide">
          LỊCH ÂM VIỆT
        </h1>
        <div className="flex items-center gap-2">
          {!isToday && (
            <button
              onClick={() => setSelectedDate(new Date())}
              className="text-xs px-3 py-1 rounded border border-vn text-primary font-semibold cursor-pointer hover:bg-black/5 transition-colors"
              aria-label="Về hôm nay"
            >
              Hôm nay
            </button>
          )}
          <Calendar
            size={22}
            strokeWidth={1.5}
            color="var(--color-primary)"
            aria-hidden="true"
          />
        </div>
      </header>

      {/* DayHero */}
      <DayHero date={selectedDate} onDateChange={setSelectedDate} />

      {/* DayInfoCard */}
      <DayInfoCard
        canChi={canChi}
        hoangDaoHours={hoangDaoHours}
        isHoangDao={currentHoangDao}
      />

      {/* Notes placeholder */}
      <section className="px-4 mt-4 mb-6">
        <h2 className="font-body font-semibold text-sm text-muted-vn uppercase tracking-wider mb-3">
          Ghi Chú Hôm Nay
        </h2>
        <div
          className="rounded-xl p-4 text-sm text-muted-vn italic"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          Chưa có ghi chú nào. Nhấn + để thêm.
        </div>
      </section>
    </div>
  );
}
