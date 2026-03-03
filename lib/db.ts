import Dexie, { type Table } from "dexie";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface LunarEvent {
    id?: number;
    title: string;
    description?: string;
    /** Ngày âm lịch */
    lunarDay: number;
    lunarMonth: number;
    isLeapMonth: boolean;
    /** Lặp hàng năm theo âm lịch */
    repeatYearly: boolean;
    /** Thông báo */
    notifyEnabled: boolean;
    /** Số ngày trước để thông báo (0 = ngay hôm đó) */
    notifyDaysBefore: number;
    createdAt: number; // timestamp
    updatedAt: number;
}

export interface DailyNote {
    id?: number;
    /** ISO date string YYYY-MM-DD (dương lịch) */
    solarDate: string;
    content: string;
    isChecked: boolean;
    /** Ghi chú hệ thống (auto-generated) */
    isSystemNote: boolean;
    createdAt: number;
}

export interface SyncQueueItem {
    id?: number;
    operation: "create" | "update" | "delete";
    table: "events" | "dailyNotes";
    recordId: number;
    data: unknown;
    createdAt: number;
}

/* ============================================================
 * DATABASE
 * ============================================================ */

class LichAmDB extends Dexie {
    events!: Table<LunarEvent>;
    dailyNotes!: Table<DailyNote>;
    syncQueue!: Table<SyncQueueItem>;

    constructor() {
        super("LichAmViet");
        this.version(1).stores({
            events: "++id, lunarMonth, lunarDay, repeatYearly",
            dailyNotes: "++id, solarDate",
            syncQueue: "++id, createdAt, table",
        });
    }
}

export const db = new LichAmDB();

/* ============================================================
 * QUERY HELPERS
 * ============================================================ */

/** Lấy ghi chú của một ngày dương lịch */
export async function getNotesByDate(solarDate: string): Promise<DailyNote[]> {
    return db.dailyNotes.where("solarDate").equals(solarDate).toArray();
}

/** Lấy sự kiện theo tháng âm lịch */
export async function getEventsByLunarMonth(lunarMonth: number): Promise<LunarEvent[]> {
    return db.events.where("lunarMonth").equals(lunarMonth).toArray();
}

/** Thêm ghi chú mới */
export async function addNote(solarDate: string, content: string, isSystemNote = false): Promise<number> {
    return db.dailyNotes.add({
        solarDate,
        content,
        isChecked: false,
        isSystemNote,
        createdAt: Date.now(),
    });
}

/** Toggle checkbox ghi chú */
export async function toggleNote(id: number): Promise<void> {
    const note = await db.dailyNotes.get(id);
    if (note) await db.dailyNotes.update(id, { isChecked: !note.isChecked });
}

/** Xóa ghi chú */
export async function deleteNote(id: number): Promise<void> {
    await db.dailyNotes.delete(id);
}

/** Thêm sự kiện */
export async function addEvent(event: Omit<LunarEvent, "id" | "createdAt" | "updatedAt">): Promise<number> {
    const now = Date.now();
    return db.events.add({ ...event, createdAt: now, updatedAt: now });
}
