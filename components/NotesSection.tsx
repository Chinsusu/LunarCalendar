"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, CheckSquare, Square } from "lucide-react";
import { useNotes } from "@/hooks/useNotes";
import type { DailyNote } from "@/lib/db";

interface NotesSectionProps {
    date: Date;
}

export function NotesSection({ date }: NotesSectionProps) {
    const { notes, add, toggle, remove } = useNotes(date);
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleAdd() {
        const t = input.trim();
        if (!t) return;
        await add(t);
        setInput("");
        inputRef.current?.focus();
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") handleAdd();
    }

    return (
        <section className="px-4 mt-2 mb-6" aria-label="Ghi chú hôm nay">
            <h2 className="font-body font-semibold text-xs text-muted-vn uppercase tracking-wider mb-3">
                Ghi Chú Hôm Nay
            </h2>

            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)", background: "var(--color-card)", boxShadow: "var(--shadow-sm)" }}>
                {/* Note list */}
                {notes.length === 0 ? (
                    <p className="text-sm text-muted-vn italic px-4 py-3">Chưa có ghi chú nào.</p>
                ) : (
                    <ul>
                        {notes.map((note: DailyNote) => (
                            <li
                                key={note.id}
                                className="flex items-start gap-2 px-4 py-3 border-b last:border-b-0 transition-colors hover:bg-black/5"
                                style={{ borderColor: "var(--color-border)" }}
                            >
                                <button
                                    onClick={() => toggle(note.id!)}
                                    className="mt-0.5 cursor-pointer flex-shrink-0 transition-colors"
                                    aria-label={note.isChecked ? "Bỏ đánh dấu" : "Đánh dấu hoàn thành"}
                                    style={{ color: note.isChecked ? "var(--color-hoang-dao)" : "var(--color-muted)" }}
                                >
                                    {note.isChecked
                                        ? <CheckSquare size={17} strokeWidth={1.5} />
                                        : <Square size={17} strokeWidth={1.5} />
                                    }
                                </button>
                                <span
                                    className="flex-1 leading-snug"
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontWeight: note.isSystemNote ? 400 : 600,
                                        fontSize: note.isSystemNote ? 13 : 15,
                                        color: note.isSystemNote ? "var(--color-muted)" : "var(--color-ink)",
                                        textDecoration: note.isChecked ? "line-through" : "none",
                                        opacity: note.isChecked ? 0.5 : 1,
                                        fontStyle: note.isSystemNote ? "italic" : "normal",
                                    }}
                                >
                                    {note.content}
                                </span>
                                {!note.isSystemNote && (
                                    <button
                                        onClick={() => remove(note.id!)}
                                        className="cursor-pointer flex-shrink-0 transition-colors hover:opacity-70"
                                        aria-label="Xóa ghi chú"
                                        style={{ color: "var(--color-muted)" }}
                                    >
                                        <Trash2 size={15} strokeWidth={1.5} />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Add note input */}
                <div className="flex items-center gap-2 px-3 py-2.5 border-t"
                    style={{ borderColor: "var(--color-border)" }}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="+ Thêm ghi chú..."
                        className="flex-1 bg-transparent text-sm outline-none font-body"
                        style={{ color: "var(--color-text)" }}
                        aria-label="Nhập ghi chú mới"
                        maxLength={200}
                    />
                    {input.trim() && (
                        <button
                            onClick={handleAdd}
                            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                            style={{ background: "var(--color-primary)" }}
                            aria-label="Thêm ghi chú"
                        >
                            <Plus size={16} color="#FFF8F0" strokeWidth={2} />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
