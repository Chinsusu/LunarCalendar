"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getLunarFromDate, formatSolarDateLong, addDays } from "@/lib/utils";
import type { LunarDate } from "@/lib/lunar";

/* ─── Typography System ─────────────────────────────────────
 * Font A: Lora Bold      — Hero:    số ngày (88px), tên tháng (22px)
 * Font B: BVP SemiBold   — Primary: ngày DL, năm Can Chi (15px/17px)
 * Font C: BVP Regular    — Secondary: label phụ (13px, muted)
 *
 * Color 1: var(--color-primary) #8B1A1A  — Hero & Primary đỏ
 * Color 2: var(--color-ink)     #3D2B1A  — ngày Dương lịch
 * Color 3: var(--color-muted)   #94837A  — text phụ / secondary
 * ─────────────────────────────────────────────────────────── */

interface DayHeroProps {
    date: Date;
    onDateChange: (date: Date) => void;
}

export function DayHero({ date, onDateChange }: DayHeroProps) {
    const [lunar, setLunar] = useState<LunarDate | null>(null);
    const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);

    useEffect(() => { setLunar(getLunarFromDate(date)); }, [date]);

    function navigate(dir: "prev" | "next") {
        setAnimDir(dir === "prev" ? "right" : "left");
        setTimeout(() => { onDateChange(addDays(date, dir === "next" ? 1 : -1)); setAnimDir(null); }, 200);
    }

    let touchStartX = 0;
    function onTouchStart(e: React.TouchEvent) { touchStartX = e.touches[0].clientX; }
    function onTouchEnd(e: React.TouchEvent) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) navigate(dx < 0 ? "next" : "prev");
    }

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "ArrowRight") navigate("next");
            if (e.key === "ArrowLeft") navigate("prev");
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    if (!lunar) return <div style={{ minHeight: 240 }} aria-label="Đang tải..." />;

    const animClass = animDir === "left" ? "animate-slide-in" : animDir === "right" ? "animate-slide-out" : "";

    return (
        <section
            className="relative flex flex-col items-center justify-center py-8 px-4 overflow-hidden select-none"
            style={{ minHeight: 240 }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            aria-label="Ngày âm lịch hôm nay"
        >
            {/* Watermark trống đồng */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-no-repeat bg-center pointer-events-none"
                style={{ backgroundImage: "url('/background.png')", backgroundSize: "85%", opacity: 0.18 }}
            />

            {/* Nav buttons */}
            <button onClick={() => navigate("prev")} aria-label="Ngày hôm qua"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-black/5 cursor-pointer transition-colors">
                <ChevronLeft size={22} color="var(--color-primary)" strokeWidth={1.5} />
            </button>
            <button onClick={() => navigate("next")} aria-label="Ngày mai"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-black/5 cursor-pointer transition-colors">
                <ChevronRight size={22} color="var(--color-primary)" strokeWidth={1.5} />
            </button>

            {/* Content */}
            <div className={`flex flex-col items-center z-10 gap-0.5 ${animClass}`}>

                {/* Font B · Color 2 · 15px — Ngày dương lịch */}
                <span style={{
                    fontFamily: "var(--font-body)", fontWeight: 600,
                    fontSize: 15, color: "var(--color-ink)", letterSpacing: "0.01em",
                }}>
                    {formatSolarDateLong(date)}
                </span>

                {/* Font A · Color 1 · 88px — Số ngày âm lịch */}
                <span style={{
                    fontFamily: "var(--font-display)", fontWeight: 700,
                    fontSize: 88, lineHeight: 1, color: "var(--color-primary)",
                }} aria-label={`Ngày ${lunar.day} âm lịch`}>
                    {lunar.day}
                </span>

                {/* Font A · Color 1 · 22px — Tháng */}
                <span style={{
                    fontFamily: "var(--font-display)", fontWeight: 600,
                    fontSize: 22, color: "var(--color-primary)", marginTop: 2,
                }}>
                    {lunar.monthName}
                </span>

                {/* Font B · Color 1 · 17px — Năm Can Chi */}
                <span style={{
                    fontFamily: "var(--font-body)", fontWeight: 600,
                    fontSize: 17, color: "var(--color-primary)", marginTop: 4,
                }}>
                    Năm {lunar.yearName}
                </span>
            </div>
        </section>
    );
}
