import { solarToLunar } from "./lunar";

/** Format ngày dương lịch → ISO string YYYY-MM-DD */
export function toISODate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

/** Tên thứ trong tuần tiếng Việt */
export function getVietnameseDayOfWeek(date: Date): string {
    const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    return days[date.getDay()];
}

/** Format ngày dương lịch dạng dài: "Thứ Ba, ngày 3 tháng 3 năm 2026" */
export function formatSolarDateLong(date: Date): string {
    const dow = getVietnameseDayOfWeek(date);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return `${dow}, ngày ${d} tháng ${m} năm ${y}`;
}

/** Format giờ địa chi: "07:00 – 09:00" */
export function formatHourRange(startHour: number, endHour: number): string {
    const fmt = (h: number) => String(h).padStart(2, "0") + ":00";
    return `${fmt(startHour)} – ${fmt(endHour)}`;
}

/** Ngày đặc biệt âm lịch */
export function isSpecialLunarDay(lunarDay: number): "ram" | "mung-mot" | null {
    if (lunarDay === 15) return "ram";
    if (lunarDay === 1) return "mung-mot";
    return null;
}

/** Lấy LunarDate từ Date object */
export function getLunarFromDate(date: Date) {
    return solarToLunar(date.getDate(), date.getMonth() + 1, date.getFullYear());
}

/** Thêm n ngày vào Date */
export function addDays(date: Date, n: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}

/** Clamp số ngày âm lịch khi đổi tháng */
export function clampLunarDay(day: number, maxDay: number): number {
    return Math.min(Math.max(1, day), maxDay);
}
