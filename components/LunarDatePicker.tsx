"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { daysInLunarMonth, getLeapMonth, lunarToSolar } from "@/lib/lunar";
import { clampLunarDay } from "@/lib/utils";

const THANG_LABELS = ["", "Tháng Giêng", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu", "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Chạp"];
const ITEM_H = 48; // px mỗi item

interface LunarDatePickerProps {
    initialYear?: number;
    initialMonth?: number;
    initialDay?: number;
    onConfirm: (year: number, month: number, day: number, isLeap: boolean) => void;
    onClose: () => void;
}

function Drum({
    items,
    selectedIndex,
    onSelect,
    ariaLabel,
}: {
    items: string[];
    selectedIndex: number;
    onSelect: (i: number) => void;
    ariaLabel: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startY = useRef(0);
    const startIdx = useRef(0);

    function clamp(i: number) { return Math.max(0, Math.min(items.length - 1, i)); }

    function scrollToIndex(i: number, smooth = true) {
        if (!ref.current) return;
        ref.current.scrollTo({ top: i * ITEM_H, behavior: smooth ? "smooth" : "instant" });
    }

    useEffect(() => { scrollToIndex(selectedIndex, false); }, [selectedIndex]);

    function onScroll() {
        if (!ref.current || isDragging.current) return;
        const idx = clamp(Math.round(ref.current.scrollTop / ITEM_H));
        if (idx !== selectedIndex) onSelect(idx);
    }

    function onTouchStart(e: React.TouchEvent) {
        isDragging.current = true;
        startY.current = e.touches[0].clientY;
        startIdx.current = selectedIndex;
    }

    function onTouchMove(e: React.TouchEvent) {
        const dy = startY.current - e.touches[0].clientY;
        const newIdx = clamp(startIdx.current + Math.round(dy / ITEM_H));
        if (newIdx !== selectedIndex) { onSelect(newIdx); scrollToIndex(newIdx); }
    }

    function onTouchEnd() { isDragging.current = false; }

    // Haptic feedback
    function haptic() {
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(5);
    }

    return (
        <div className="relative flex-1 overflow-hidden" style={{ height: ITEM_H * 5 }}>
            {/* Gradient fades top & bottom */}
            <div className="absolute inset-x-0 top-0 h-16 z-10 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, var(--color-card), transparent)" }} />
            <div className="absolute inset-x-0 bottom-0 h-16 z-10 pointer-events-none"
                style={{ background: "linear-gradient(to top, var(--color-card), transparent)" }} />
            {/* Selected highlight */}
            <div className="absolute inset-x-0 z-10 pointer-events-none border-y"
                style={{ top: ITEM_H * 2, height: ITEM_H, borderColor: "var(--color-border)" }} />

            <div
                ref={ref}
                aria-label={ariaLabel}
                role="listbox"
                className="overflow-y-scroll h-full"
                style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
                onScroll={onScroll}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Padding items */}
                {Array(2).fill(null).map((_, i) => <div key={`t${i}`} style={{ height: ITEM_H }} />)}
                {items.map((label, i) => (
                    <div
                        key={label}
                        role="option"
                        aria-selected={i === selectedIndex}
                        onClick={() => { onSelect(i); scrollToIndex(i); haptic(); }}
                        className="flex items-center justify-center cursor-pointer transition-all"
                        style={{
                            height: ITEM_H,
                            scrollSnapAlign: "center",
                            fontSize: i === selectedIndex ? 17 : 14,
                            fontWeight: i === selectedIndex ? 600 : 400,
                            color: i === selectedIndex ? "var(--color-primary)" : "var(--color-muted)",
                            fontFamily: "var(--font-body)",
                        }}
                    >
                        {label}
                    </div>
                ))}
                {Array(2).fill(null).map((_, i) => <div key={`b${i}`} style={{ height: ITEM_H }} />)}
            </div>
        </div>
    );
}

export function LunarDatePicker({ initialYear, initialMonth, initialDay, onConfirm, onClose }: LunarDatePickerProps) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    const [year, setYear] = useState(initialYear ?? currentYear);
    const [month, setMonth] = useState(initialMonth ?? new Date().getMonth() + 1);
    const [isLeap, setIsLeap] = useState(false);
    const [day, setDay] = useState(initialDay ?? 1);

    const leapMonth = getLeapMonth(year);
    const maxDays = daysInLunarMonth(year, month, isLeap);
    const clampedDay = clampLunarDay(day, maxDays);

    // Tạo labels tháng
    const monthLabels = Array.from({ length: 12 }, (_, i) => {
        const m = i + 1;
        return m === leapMonth ? [`Tháng ${m}`, `Tháng ${m} (Nhuận)`] : [THANG_LABELS[m]];
    }).flat();

    // Convert month index trong drum → (month, isLeap)
    const monthItems = Array.from({ length: 12 }, (_, i) => {
        const m = i + 1;
        if (m === leapMonth) return [{ m, leap: false }, { m, leap: true }];
        return [{ m, leap: false }];
    }).flat();

    const monthDrumIdx = monthItems.findIndex(x => x.m === month && x.leap === isLeap);

    function handleMonthSelect(idx: number) {
        const { m, leap } = monthItems[idx];
        setMonth(m);
        setIsLeap(leap);
    }

    // Preview solar date
    let previewText = "";
    try {
        const solar = lunarToSolar(clampedDay, month, year, isLeap);
        const dow = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][solar.getDay()];
        previewText = `= ${dow}, ${String(solar.getDate()).padStart(2, "0")}/${String(solar.getMonth() + 1).padStart(2, "0")}/${solar.getFullYear()} (Dương lịch)`;
    } catch { previewText = "Ngày không hợp lệ"; }

    const dayLabels = Array.from({ length: maxDays }, (_, i) => String(i + 1));
    const yearLabels = years.map(String);

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div
                className="relative w-full max-w-[480px] rounded-t-2xl shadow-lg"
                style={{ background: "var(--color-card)" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-vn">
                    <button onClick={onClose} className="p-1 cursor-pointer text-muted-vn hover:text-ink transition-colors" aria-label="Đóng">
                        <X size={20} />
                    </button>
                    <span className="font-display font-semibold text-primary text-base">Chọn Ngày Âm Lịch</span>
                    <button
                        className="btn-primary text-sm px-4 py-1.5"
                        onClick={() => onConfirm(year, month, clampedDay, isLeap)}
                    >
                        Xong
                    </button>
                </div>

                {/* Columns */}
                <div className="flex px-2 py-2 gap-1" style={{ background: "var(--color-card)" }}>
                    <Drum
                        items={dayLabels}
                        selectedIndex={clampedDay - 1}
                        onSelect={i => setDay(i + 1)}
                        ariaLabel="Chọn ngày âm lịch"
                    />
                    <Drum
                        items={monthLabels}
                        selectedIndex={Math.max(0, monthDrumIdx)}
                        onSelect={handleMonthSelect}
                        ariaLabel="Chọn tháng âm lịch"
                    />
                    <Drum
                        items={yearLabels}
                        selectedIndex={years.indexOf(year)}
                        onSelect={i => setYear(years[i])}
                        ariaLabel="Chọn năm âm lịch"
                    />
                </div>

                {/* Preview */}
                <div className="px-4 pb-5 text-center">
                    <span className="text-sm font-body" style={{ color: "var(--color-secondary)" }}>
                        {previewText}
                    </span>
                </div>
            </div>
        </div>
    );
}
