"use client";

import { useState, useEffect, useCallback } from "react";
import { db, type DailyNote, addNote, toggleNote, deleteNote } from "@/lib/db";
import { toISODate, getLunarFromDate } from "@/lib/utils";

/** System notes tự động: Rằm và Mùng 1 âm lịch */
const SYSTEM_NOTES: Record<number, string> = {
    15: "🌕 Rằm — Lễ cúng Phật, thắp hương, ăn chay",
    1: "🌑 Mùng Một — Cúng gia tiên, thắp nhang ban thờ",
};

export function useNotes(date: Date) {
    const [notes, setNotes] = useState<DailyNote[]>([]);
    const solarDate = toISODate(date);

    const refresh = useCallback(async () => {
        const result = await db.dailyNotes
            .where("solarDate").equals(solarDate)
            .sortBy("createdAt");
        setNotes(result);
    }, [solarDate]);

    /** Tự động thêm system note Rằm/Mùng Một nếu chưa có */
    const ensureSystemNote = useCallback(async () => {
        const lunar = getLunarFromDate(date);
        const template = SYSTEM_NOTES[lunar.day];
        if (!template) return;

        const existing = await db.dailyNotes
            .where("solarDate").equals(solarDate)
            .filter(n => n.isSystemNote)
            .first();

        if (!existing) {
            await addNote(solarDate, template, true);
            await refresh();
        }
    }, [date, solarDate, refresh]);

    useEffect(() => {
        refresh();
        ensureSystemNote();
    }, [refresh, ensureSystemNote]);

    const add = useCallback(async (content: string) => {
        await addNote(solarDate, content, false);
        await refresh();
    }, [solarDate, refresh]);

    const toggle = useCallback(async (id: number) => {
        await toggleNote(id);
        await refresh();
    }, [refresh]);

    const remove = useCallback(async (id: number) => {
        await deleteNote(id);
        await refresh();
    }, [refresh]);

    return { notes, add, toggle, remove, refresh };
}
