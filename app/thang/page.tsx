"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MonthCalendar } from "@/components/MonthCalendar";
import { toISODate } from "@/lib/utils";

export default function LichThangPage() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const router = useRouter();

    function prevMonth() {
        if (month === 1) { setMonth(12); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    }

    function nextMonth() {
        if (month === 12) { setMonth(1); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    }

    /** M-06: Tap ngày → navigate về Lịch Ngày với query date */
    function handleDateClick(date: Date) {
        router.push(`/?date=${toISODate(date)}`);
    }

    return (
        <div>
            {/* AppBar */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-vn sticky top-0 z-20 bg-card-vn">
                <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--color-primary)", letterSpacing: "0.05em" }}>LỊCH THÁNG</h1>
                <button
                    onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth() + 1); }}
                    className="text-xs px-3 py-1 rounded border border-vn text-primary font-semibold cursor-pointer hover:bg-black/5 transition-colors"
                >
                    Tháng này
                </button>
            </header>

            <MonthCalendar
                year={year}
                month={month}
                today={today}
                onPrevMonth={prevMonth}
                onNextMonth={nextMonth}
                onDateClick={handleDateClick}
            />
        </div>
    );
}
