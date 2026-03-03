"use client";

import { useState } from "react";
import { Plus, Trash2, Bell, BellOff, CalendarDays } from "lucide-react";
import { EventForm } from "@/components/EventForm";
import { useEvents } from "@/hooks/useEvents";
import { solarToLunar } from "@/lib/lunar";

const THANG = ["", "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng Chạp"];

export default function SuKienPage() {
    const today = new Date();
    const lunarToday = solarToLunar(today.getDate(), today.getMonth() + 1, today.getFullYear());
    const [showForm, setShowForm] = useState(false);
    const [filterMonth, setFilterMonth] = useState(lunarToday.month);
    const { events, add, remove } = useEvents(filterMonth);

    return (
        <div>
            {/* AppBar */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-vn sticky top-0 z-20 bg-card-vn">
                <h1 className="font-display font-bold text-lg text-primary tracking-wide">SỰ KIỆN</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded cursor-pointer transition-colors font-semibold"
                    style={{ background: "var(--color-primary)", color: "#FFF8F0" }}
                    aria-label="Thêm sự kiện mới"
                >
                    <Plus size={14} /> Thêm
                </button>
            </header>

            {/* Month filter */}
            <div className="px-4 py-3 overflow-x-auto">
                <div className="flex gap-1.5 w-max">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <button
                            key={m}
                            onClick={() => setFilterMonth(m)}
                            className="px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
                            style={{
                                background: m === filterMonth ? "var(--color-primary)" : "var(--color-card)",
                                color: m === filterMonth ? "#FFF8F0" : "var(--color-muted)",
                                border: `1px solid ${m === filterMonth ? "var(--color-primary)" : "var(--color-border)"}`,
                            }}
                            aria-pressed={m === filterMonth}
                        >
                            {THANG[m].replace("Tháng ", "T.")}
                        </button>
                    ))}
                </div>
            </div>

            {/* Event list */}
            <div className="px-4 pb-6">
                {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-vn">
                        <CalendarDays size={40} strokeWidth={1} color="var(--color-border)" />
                        <p className="text-sm">Chưa có sự kiện nào trong {THANG[filterMonth]}</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="text-sm text-primary font-semibold underline cursor-pointer"
                        >
                            + Thêm sự kiện
                        </button>
                    </div>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {events.map(event => (
                            <li
                                key={event.id}
                                className="rounded-xl px-4 py-3 flex items-start gap-3"
                                style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}
                            >
                                {/* Date badge */}
                                <div
                                    className="flex-shrink-0 w-10 h-10 rounded-lg flex flex-col items-center justify-center"
                                    style={{ background: "var(--color-primary)" }}
                                    aria-label={`Ngày ${event.lunarDay} tháng ${event.lunarMonth} âm lịch`}
                                >
                                    <span className="text-white font-bold text-[15px] leading-none">{event.lunarDay}</span>
                                    <span className="text-white/80 text-[9px]">/{event.lunarMonth}{event.isLeapMonth ? "n" : ""}</span>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-ink truncate">{event.title}</p>
                                    {event.description && (
                                        <p className="text-xs text-muted-vn mt-0.5 line-clamp-2">{event.description}</p>
                                    )}
                                    <div className="flex items-center gap-2 mt-1">
                                        {event.repeatYearly && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded"
                                                style={{ background: "#FDF8EC", color: "var(--color-secondary)", border: "1px solid var(--color-border)" }}>
                                                Hàng năm
                                            </span>
                                        )}
                                        {event.notifyEnabled
                                            ? <Bell size={11} color="var(--color-accent)" />
                                            : <BellOff size={11} color="var(--color-muted)" />
                                        }
                                    </div>
                                </div>

                                {/* Delete */}
                                <button
                                    onClick={() => {
                                        if (window.confirm(`Xóa sự kiện "${event.title}"?`)) remove(event.id!);
                                    }}
                                    className="flex-shrink-0 cursor-pointer p-1 hover:opacity-70 transition-opacity"
                                    aria-label={`Xóa sự kiện ${event.title}`}
                                    style={{ color: "var(--color-muted)" }}
                                >
                                    <Trash2 size={16} strokeWidth={1.5} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* FAB */}
            <button
                onClick={() => setShowForm(true)}
                className="fixed right-4 cursor-pointer w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 z-30"
                style={{ bottom: 76, background: "var(--color-primary)" }}
                aria-label="Thêm sự kiện mới"
            >
                <Plus size={24} color="#FFF8F0" strokeWidth={2} />
            </button>

            {showForm && (
                <EventForm
                    onSave={async (e) => { await add(e); }}
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    );
}
