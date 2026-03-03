"use client";

import { useState, useEffect, useCallback } from "react";
import { db, type DailyNote, addNote, toggleNote, deleteNote } from "@/lib/db";
import { toISODate } from "@/lib/utils";

export function useNotes(date: Date) {
    const [notes, setNotes] = useState<DailyNote[]>([]);
    const solarDate = toISODate(date);

    const refresh = useCallback(async () => {
        const result = await db.dailyNotes
            .where("solarDate").equals(solarDate)
            .sortBy("createdAt");
        setNotes(result);
    }, [solarDate]);

    useEffect(() => { refresh(); }, [refresh]);

    const add = useCallback(async (content: string) => {
        await addNote(solarDate, content);
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
