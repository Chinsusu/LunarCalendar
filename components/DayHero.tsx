"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getLunarFromDate, formatSolarDateLong, addDays } from "@/lib/utils";
import type { LunarDate } from "@/lib/lunar";

interface DayHeroProps {
    date: Date;
    onDateChange: (date: Date) => void;
}

export function DayHero({ date, onDateChange }: DayHeroProps) {
    const [lunar, setLunar] = useState<LunarDate | null>(null);
    const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);

    useEffect(() => {
        setLunar(getLunarFromDate(date));
    }, [date]);

    function navigate(dir: "prev" | "next") {
        setAnimDir(dir === "prev" ? "right" : "left");
        setTimeout(() => {
            onDateChange(addDays(date, dir === "next" ? 1 : -1));
            setAnimDir(null);
        }, 200);
    }

    // Swipe support
    let touchStartX = 0;
    function onTouchStart(e: React.TouchEvent) { touchStartX = e.touches[0].clientX; }
    function onTouchEnd(e: React.TouchEvent) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) navigate(dx < 0 ? "next" : "prev");
    }

    // Keyboard support
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "ArrowRight") navigate("next");
            if (e.key === "ArrowLeft") navigate("prev");
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    if (!lunar) return <div className="day-hero-skeleton" aria-label="Đang tải..." />;

    const animClass = animDir === "left"
        ? "animate-slide-in" : animDir === "right"
            ? "animate-slide-out" : "";

    return (
        <section
            className="relative flex flex-col items-center justify-center py-8 px-4 overflow-hidden select-none"
            style={{ minHeight: 220 }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            aria-label="Ngày âm lịch hôm nay"
        >
            {/* Watermark trống đồng Đông Sơn thật */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-no-repeat bg-center pointer-events-none"
                style={{
                    backgroundImage: "url('/background.jpg')",
                    backgroundSize: "75%",
                    opacity: 0.10,
                }}
            />

            {/* Navigation buttons */}
            <button
                onClick={() => navigate("prev")}
                aria-label="Ngày hôm qua"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-black/5 transition-colors cursor-pointer"
            >
                <ChevronLeft size={22} color="var(--color-primary)" strokeWidth={1.5} />
            </button>
            <button
                onClick={() => navigate("next")}
                aria-label="Ngày mai"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-black/5 transition-colors cursor-pointer"
            >
                <ChevronRight size={22} color="var(--color-primary)" strokeWidth={1.5} />
            </button>

            {/* Content */}
            <div className={`flex flex-col items-center gap-1 z-10 ${animClass}`}>
                {/* Lunar day number */}
                <span
                    className="font-display font-bold text-primary animate-fade-in-1"
                    style={{ fontSize: 80, lineHeight: 1, color: "var(--color-primary)" }}
                    aria-label={`Ngày ${lunar.day} âm lịch`}
                >
                    {lunar.day}
                </span>

                {/* Month */}
                <div className="flex flex-col items-center animate-fade-in-2">
                    <span className="font-display font-semibold text-[22px] text-primary">
                        {lunar.monthName}
                    </span>
                    <span className="text-label text-muted-vn">(Âm)</span>
                </div>

                {/* Dương lịch */}
                <div className="mt-1 animate-fade-in-2">
                    <span className="text-sm font-body text-ink/70">
                        {formatSolarDateLong(date)}
                    </span>
                </div>

                {/* Can Chi năm */}
                <div className="flex flex-col items-center mt-2 animate-fade-in-3">
                    <span className="font-body font-semibold text-[17px] text-primary">
                        Năm {lunar.yearName}
                    </span>
                    <span className="text-label text-muted-vn">(Can Chi)</span>
                </div>
            </div>
        </section>
    );
}
