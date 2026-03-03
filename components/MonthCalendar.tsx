"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { solarToLunar, getHoangDao } from "@/lib/lunar";
import { isSpecialLunarDay, toISODate } from "@/lib/utils";

interface MonthCalendarProps {
    year: number;
    month: number; // 1-12 dương lịch
    today?: Date;
    eventDates?: Set<string>; // ISO date strings có sự kiện
    onDateClick?: (date: Date) => void;
    onPrevMonth: () => void;
    onNextMonth: () => void;
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
    // 0=Sun,1=Mon,...6=Sat → convert to Mon=0..Sun=6
    const d = new Date(year, month - 1, 1).getDay();
    return d === 0 ? 6 : d - 1;
}

export function MonthCalendar({
    year, month, today = new Date(),
    eventDates = new Set(),
    onDateClick, onPrevMonth, onNextMonth,
}: MonthCalendarProps) {
    const totalDays = getDaysInMonth(year, month);
    const firstOffset = getFirstDayOfWeek(year, month);
    const todayStr = toISODate(today);

    // Pre-compute lunar for all days in month
    const lunarDays = useMemo(() =>
        Array.from({ length: totalDays }, (_, i) => {
            const d = i + 1;
            return solarToLunar(d, month, year);
        }),
        [year, month, totalDays]
    );

    // Lịch tháng: các ô (kể cả padding)
    const totalCells = Math.ceil((firstOffset + totalDays) / 7) * 7;
    const cells = Array.from({ length: totalCells }, (_, i) => {
        const dayNum = i - firstOffset + 1;
        if (dayNum < 1 || dayNum > totalDays) return null;
        return dayNum;
    });

    const monthNames = ["", "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng Chạp"];

    return (
        <div className="px-3 pt-2 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-1">
                <button
                    onClick={onPrevMonth}
                    className="p-2 rounded-md hover:bg-black/5 transition-colors cursor-pointer"
                    aria-label="Tháng trước"
                >
                    <ChevronLeft size={20} color="var(--color-primary)" strokeWidth={1.5} />
                </button>
                <div className="text-center">
                    <span className="font-display font-semibold text-base text-primary">
                        {monthNames[month]} / {year}
                    </span>
                </div>
                <button
                    onClick={onNextMonth}
                    className="p-2 rounded-md hover:bg-black/5 transition-colors cursor-pointer"
                    aria-label="Tháng sau"
                >
                    <ChevronRight size={20} color="var(--color-primary)" strokeWidth={1.5} />
                </button>
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map(d => (
                    <div key={d} className="text-center text-[11px] font-semibold pb-2"
                        style={{ color: d === "CN" ? "var(--color-primary)" : "var(--color-muted)" }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-y-1">
                {cells.map((day, idx) => {
                    if (!day) return <div key={idx} />;

                    const date = new Date(year, month - 1, day);
                    const dateStr = toISODate(date);
                    const lunar = lunarDays[day - 1];
                    const special = isSpecialLunarDay(lunar.day);
                    const isToday = dateStr === todayStr;
                    const hasEvent = eventDates.has(dateStr);
                    const isSun = date.getDay() === 0;
                    // Hoàng Đạo check dùng giờ Tý (23) làm đại diện
                    const hoangDaoList = getHoangDao(lunar.day, lunar.month, lunar.year);
                    const isHD = hoangDaoList.some(h => h.isHoangDao && h.chi === "Tý");

                    return (
                        <button
                            key={idx}
                            onClick={() => onDateClick?.(date)}
                            aria-label={`Ngày ${day} tháng ${month} — âm lịch ${lunar.day}/${lunar.month}`}
                            aria-current={isToday ? "date" : undefined}
                            className="relative flex flex-col items-center justify-center py-1 rounded-lg transition-colors cursor-pointer hover:bg-black/5"
                            style={{ minHeight: 52 }}
                        >
                            {/* Solar day */}
                            <span
                                className="w-7 h-7 flex items-center justify-center rounded-full text-[15px] font-semibold transition-colors"
                                style={{
                                    background: isToday ? "var(--color-primary)" : "transparent",
                                    color: isToday ? "#FFF8F0"
                                        : special ? "var(--color-primary)"
                                            : isSun ? "var(--color-hac-dao)"
                                                : "var(--color-text)",
                                }}
                            >
                                {day}
                            </span>

                            {/* Lunar day */}
                            <span
                                className="text-[10px] leading-tight mt-0.5"
                                style={{ color: special ? "var(--color-primary)" : "var(--color-muted)" }}
                            >
                                {lunar.day}{lunar.isLeapMonth ? "n" : ""}
                            </span>

                            {/* Hoàng Đạo gold underline */}
                            {isHD && !isToday && (
                                <span
                                    className="absolute bottom-1 w-4 h-0.5 rounded-full"
                                    style={{ background: "var(--color-accent)" }}
                                    aria-hidden="true"
                                />
                            )}

                            {/* Event dot */}
                            {hasEvent && (
                                <span
                                    className="absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full"
                                    style={{ background: "var(--color-secondary)" }}
                                    aria-hidden="true"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
