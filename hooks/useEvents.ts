"use client";

import { useState, useEffect, useCallback } from "react";
import { db, type LunarEvent, addEvent } from "@/lib/db";

export function useEvents(lunarMonth: number) {
    const [events, setEvents] = useState<LunarEvent[]>([]);

    const refresh = useCallback(async () => {
        const result = await db.events
            .where("lunarMonth").equals(lunarMonth)
            .sortBy("lunarDay");
        setEvents(result);
    }, [lunarMonth]);

    useEffect(() => { refresh(); }, [refresh]);

    const add = useCallback(async (event: Omit<LunarEvent, "id" | "createdAt" | "updatedAt">) => {
        await addEvent(event);
        await refresh();
    }, [refresh]);

    const remove = useCallback(async (id: number) => {
        await db.events.delete(id);
        await refresh();
    }, [refresh]);

    return { events, add, remove, refresh };
}
