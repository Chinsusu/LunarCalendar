"use client";

import { useState } from "react";
import { X, Bell, Calendar } from "lucide-react";
import { LunarDatePicker } from "./LunarDatePicker";
import { updateEvent } from "@/lib/db";
import type { LunarEvent } from "@/lib/db";

interface EventFormProps {
    onSave: (event: Omit<LunarEvent, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    onClose: () => void;
    /** Truyền vào để edit mode */
    initial?: Partial<LunarEvent>;
    editId?: number;
}

export function EventForm({ onSave, onClose, initial, editId }: EventFormProps) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [description, setDesc] = useState(initial?.description ?? "");
    const [lunarDay, setDay] = useState(initial?.lunarDay ?? 1);
    const [lunarMonth, setMonth] = useState(initial?.lunarMonth ?? 1);
    const [isLeap, setIsLeap] = useState(initial?.isLeapMonth ?? false);
    const [repeatYearly, setRepeat] = useState(initial?.repeatYearly ?? true);
    const [notifyEnabled, setNotify] = useState(initial?.notifyEnabled ?? false);
    const [notifyDays, setNotifyDays] = useState(initial?.notifyDaysBefore ?? 0);
    const [showPicker, setShowPicker] = useState(false);
    const [saving, setSaving] = useState(false);

    const isEdit = !!editId;

    async function handleSave() {
        if (!title.trim()) return;
        setSaving(true);
        const payload = { title: title.trim(), description, lunarDay, lunarMonth, isLeapMonth: isLeap, repeatYearly, notifyEnabled, notifyDaysBefore: notifyDays };
        if (isEdit && editId) {
            await updateEvent(editId, payload);
        } else {
            await onSave(payload);
        }
        setSaving(false);
        onClose();
    }

    const dateLabel = `Ngày ${lunarDay}/${lunarMonth}${isLeap ? " (Nhuận)" : ""} Âm lịch`;

    return (
        <>
            <div className="fixed inset-0 z-40 flex items-end justify-center">
                <div className="absolute inset-0 bg-black/40" onClick={onClose} />
                <div className="relative w-full max-w-[480px] rounded-t-2xl shadow-lg pb-8"
                    style={{ background: "var(--color-card)" }}>

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-vn">
                        <button onClick={onClose} className="p-1 cursor-pointer text-muted-vn" aria-label="Đóng">
                            <X size={20} />
                        </button>
                        <span className="font-display font-semibold text-primary">
                            {isEdit ? "Sửa Sự Kiện" : "Thêm Sự Kiện"}
                        </span>
                        <button
                            className="btn-primary text-sm px-4 py-1.5"
                            onClick={handleSave}
                            disabled={!title.trim() || saving}
                            aria-label={isEdit ? "Lưu thay đổi" : "Lưu sự kiện"}
                        >
                            {saving ? "Đang lưu..." : "Lưu"}
                        </button>
                    </div>

                    <div className="px-4 pt-4 flex flex-col gap-4">
                        {/* Tiêu đề */}
                        <div>
                            <label htmlFor="event-title" className="text-xs font-semibold text-muted-vn uppercase tracking-wide mb-1 block">
                                Tiêu đề *
                            </label>
                            <input
                                id="event-title"
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Vd: Giỗ ông nội, Rằm tháng Giêng..."
                                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-text)", fontFamily: "var(--font-body)" }}
                                onFocus={e => (e.target.style.borderColor = "var(--color-primary)")}
                                onBlur={e => (e.target.style.borderColor = "var(--color-border)")}
                                maxLength={80}
                            />
                        </div>

                        {/* Ngày âm lịch */}
                        <div>
                            <label className="text-xs font-semibold text-muted-vn uppercase tracking-wide mb-1 block">Ngày Âm Lịch</label>
                            <button
                                onClick={() => setShowPicker(true)}
                                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left cursor-pointer transition-colors hover:bg-black/5"
                                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", fontFamily: "var(--font-body)", color: "var(--color-text)" }}
                            >
                                <Calendar size={16} color="var(--color-accent)" />
                                {dateLabel}
                            </button>
                        </div>

                        {/* Ghi chú */}
                        <div>
                            <label htmlFor="event-desc" className="text-xs font-semibold text-muted-vn uppercase tracking-wide mb-1 block">Ghi Chú (tùy chọn)</label>
                            <textarea
                                id="event-desc"
                                value={description}
                                onChange={e => setDesc(e.target.value)}
                                placeholder="Thêm ghi chú..."
                                rows={2}
                                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none transition-all"
                                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-text)", fontFamily: "var(--font-body)" }}
                            />
                        </div>

                        {/* Options */}
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-body text-ink">Lặp hàng năm theo âm lịch</span>
                                <button role="switch" aria-checked={repeatYearly} onClick={() => setRepeat(r => !r)}
                                    className="w-11 h-6 rounded-full transition-colors relative"
                                    style={{ background: repeatYearly ? "var(--color-primary)" : "var(--color-border)" }}>
                                    <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                                        style={{ left: repeatYearly ? "calc(100% - 22px)" : "2px" }} />
                                </button>
                            </label>

                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-body text-ink flex items-center gap-1.5">
                                    <Bell size={14} color="var(--color-accent)" /> Thông báo
                                </span>
                                <button role="switch" aria-checked={notifyEnabled} onClick={() => setNotify(n => !n)}
                                    className="w-11 h-6 rounded-full transition-colors relative"
                                    style={{ background: notifyEnabled ? "var(--color-primary)" : "var(--color-border)" }}>
                                    <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                                        style={{ left: notifyEnabled ? "calc(100% - 22px)" : "2px" }} />
                                </button>
                            </label>

                            {notifyEnabled && (
                                <div className="flex items-center gap-2 pl-2">
                                    <span className="text-sm text-muted-vn">Nhắc trước</span>
                                    <select value={notifyDays} onChange={e => setNotifyDays(Number(e.target.value))}
                                        className="text-sm px-2 py-1 rounded border cursor-pointer"
                                        style={{ borderColor: "var(--color-border)", background: "var(--color-background)", color: "var(--color-text)" }}>
                                        <option value={0}>Ngay hôm đó</option>
                                        <option value={1}>1 ngày</option>
                                        <option value={3}>3 ngày</option>
                                        <option value={7}>1 tuần</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showPicker && (
                <LunarDatePicker
                    initialMonth={lunarMonth}
                    initialDay={lunarDay}
                    onConfirm={(_, m, d, leap) => { setMonth(m); setDay(d); setIsLeap(leap); setShowPicker(false); }}
                    onClose={() => setShowPicker(false)}
                />
            )}
        </>
    );
}
