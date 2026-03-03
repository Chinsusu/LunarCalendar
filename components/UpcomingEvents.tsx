"use client";

import { useState, useEffect } from "react";
import { CalendarDays, ChevronRight } from "lucide-react";
import { getUpcomingEvents } from "@/lib/db";
import type { LunarEvent } from "@/lib/db";

const THANG = ["", "Th.1", "Th.2", "Th.3", "Th.4", "Th.5", "Th.6", "Th.7", "Th.8", "Th.9", "Th.10", "Th.11", "Th.Chạp"];

interface UpcomingEventsProps {
    onEditEvent?: (event: LunarEvent) => void;
}

export function UpcomingEvents({ onEditEvent }: UpcomingEventsProps) {
    const [items, setItems] = useState<Array<{ event: LunarEvent; solarDate: Date }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUpcomingEvents(new Date(), 30)
            .then(data => { setItems(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return null;
    if (items.length === 0) return (
        <div className="px-4 mt-3">
            <h2 className="font-body font-semibold text-xs text-muted-vn uppercase tracking-wider mb-2">Sắp Tới (30 ngày)</h2>
            <p className="text-sm text-muted-vn italic px-4 py-3 rounded-xl"
                style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
                Không có sự kiện nào trong 30 ngày tới.
            </p>
        </div>
    );

    return (
        <div className="px-4 mt-3 mb-2">
            <h2 className="font-body font-semibold text-xs text-muted-vn uppercase tracking-wider mb-2">
                Sắp Tới (30 ngày) — {items.length} sự kiện
            </h2>
            <ul className="flex flex-col gap-1.5">
                {items.map(({ event, solarDate }, idx) => {
                    const today = new Date();
                    const diffDays = Math.round((solarDate.getTime() - today.setHours(0, 0, 0, 0)) / 86400000);
                    const diffLabel = diffDays === 0 ? "Hôm nay" : diffDays === 1 ? "Ngày mai" : `${diffDays} ngày nữa`;

                    return (
                        <li key={`${event.id}-${idx}`}>
                            <button
                                onClick={() => onEditEvent?.(event)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-colors hover:bg-black/5"
                                style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
                            >
                                {/* Date badge */}
                                <div className="flex-shrink-0 w-9 h-9 rounded-lg flex flex-col items-center justify-center"
                                    style={{ background: diffDays === 0 ? "var(--color-primary)" : "var(--color-background)", border: `1px solid ${diffDays === 0 ? "var(--color-primary)" : "var(--color-border)"}` }}>
                                    <span className="font-bold text-[13px] leading-none" style={{ color: diffDays === 0 ? "#FFF8F0" : "var(--color-primary)" }}>
                                        {solarDate.getDate()}
                                    </span>
                                    <span className="text-[9px]" style={{ color: diffDays === 0 ? "#FFF8F0" : "var(--color-muted)" }}>
                                        {THANG[solarDate.getMonth() + 1]}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-ink truncate">{event.title}</p>
                                    <p className="text-[11px] text-muted-vn">
                                        {diffLabel} · {event.lunarDay}/{event.lunarMonth}{event.isLeapMonth ? "n" : ""} ÂL
                                    </p>
                                </div>
                                <ChevronRight size={16} color="var(--color-muted)" />
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
