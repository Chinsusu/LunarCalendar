/**
 * lib/lunar.ts
 * Thuật toán chuyển đổi âm dương lịch Việt Nam (UTC+7)
 * Dựa trên: https://www.informatik.uni-leipzig.de/~duc/amlich/calrules_v.html
 * Tác giả gốc: Hồ Ngọc Đức
 */

/* ============================================================
 * TYPES
 * ============================================================ */

export interface LunarDate {
    day: number;
    month: number;
    year: number;
    isLeapMonth: boolean;
    /** "Canh Thìn" */
    dayName: string;
    /** "Tháng Hai" | "Tháng Hai (Nhuận)" */
    monthName: string;
    /** "Bính Ngọ" */
    yearName: string;
}

export interface CanChi {
    year: string;
    month: string;
    day: string;
    hour: string;
}

export interface HoangDaoHour {
    /** Tên địa chi */
    chi: string;
    /** Giờ bắt đầu (0-23), Tý = 23 */
    startHour: number;
    /** Giờ kết thúc (0-23), Tý = 1 */
    endHour: number;
    isHoangDao: boolean;
}

/* ============================================================
 * CONSTANTS
 * ============================================================ */

const THIEN_CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const DIA_CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const THANG_AM = ["", "Tháng Giêng", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu", "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Chạp"];

/** Múi giờ Việt Nam UTC+7 */
const VN_TZ = 7;

/* ============================================================
 * CORE ALGORITHM — Julian Day Number
 * ============================================================ */

function jdFromDate(dd: number, mm: number, yy: number): number {
    const a = Math.floor((14 - mm) / 12);
    const y = yy + 4800 - a;
    const m = mm + 12 * a - 3;
    let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    if (jd < 2299161) {
        jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
    }
    return jd;
}

function jdToDate(jd: number): [number, number, number] {
    let a: number, b: number, c: number;
    if (jd > 2299160) {
        a = jd + 32044;
        b = Math.floor((4 * a + 3) / 146097);
        c = a - Math.floor(146097 * b / 4);
    } else {
        b = 0;
        c = jd + 32082;
    }
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor(1461 * d / 4);
    const m = Math.floor((5 * e + 2) / 153);
    const dd = e - Math.floor((153 * m + 2) / 5) + 1;
    const mm = m + 3 - 12 * Math.floor(m / 10);
    const yy = 100 * b + d - 4800 + Math.floor(m / 10);
    return [dd, mm, yy];
}

/** Điểm Sóc (New Moon) thứ k tính theo Julian Day, timezone tz */
function getNewMoonDay(k: number, tz: number): number {
    const T = k / 1236.85;
    const T2 = T * T;
    const T3 = T2 * T;
    const dr = Math.PI / 180;
    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    let delT: number;
    if (T < -11) {
        delT = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    } else {
        delT = -0.000278 + 0.000265 * T + 0.000262 * T2;
    }
    const JdNew = Jd1 + C1 - delT;
    return Math.floor(JdNew + 0.5 + tz / 24);
}

/** Longitude mặt trời (độ) tại Julian Day jdn */
function getSunLongitude(jdn: number, tz: number): number {
    const T = (jdn - 2451545.5 - tz / 24) / 36525;
    const T2 = T * T;
    const dr = Math.PI / 180;
    const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
    let L = L0 + DL;
    L = L * dr;
    L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));
    return Math.floor(L / Math.PI * 6);
}

/** Số thứ tự tháng âm lịch (tháng 11 năm trước tính là tháng 0) */
function getLunarMonth11(yy: number, tz: number): number {
    const off = jdFromDate(31, 12, yy) - 2415021;
    const k = Math.floor(off / 29.530588853);
    let nm = getNewMoonDay(k, tz);
    const sunLong = getSunLongitude(nm, tz);
    if (sunLong >= 9) nm = getNewMoonDay(k - 1, tz);
    return nm;
}

function getLeapMonthOffset(a11: number, tz: number): number {
    const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last = 0;
    let i = 1;
    let arc = getSunLongitude(getNewMoonDay(k + i, tz), tz);
    do {
        last = arc;
        i++;
        arc = getSunLongitude(getNewMoonDay(k + i, tz), tz);
    } while (arc !== last && i < 14);
    return i - 1;
}

/* ============================================================
 * PUBLIC API
 * ============================================================ */

/**
 * Chuyển dương lịch → âm lịch Việt Nam
 */
export function solarToLunar(dd: number, mm: number, yy: number): LunarDate {
    const dayNumber = jdFromDate(dd, mm, yy);
    const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k + 1, VN_TZ);
    if (monthStart > dayNumber) monthStart = getNewMoonDay(k, VN_TZ);

    let a11 = getLunarMonth11(yy, VN_TZ);
    let b11 = a11;
    let lunarYear: number;
    if (a11 >= monthStart) {
        lunarYear = yy;
        a11 = getLunarMonth11(yy - 1, VN_TZ);
    } else {
        lunarYear = yy + 1;
        b11 = getLunarMonth11(yy + 1, VN_TZ);
    }

    const lunarDay = dayNumber - monthStart + 1;
    const diff = Math.floor((monthStart - a11) / 29);
    let isLeapMonth = false;
    let lunarMonth = diff + 11;

    if (b11 - a11 > 365) {
        const leapMonthDiff = getLeapMonthOffset(a11, VN_TZ);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
            if (diff === leapMonthDiff) isLeapMonth = true;
        }
    }
    if (lunarMonth > 12) lunarMonth -= 12;
    if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;

    return {
        day: lunarDay,
        month: lunarMonth,
        year: lunarYear,
        isLeapMonth,
        dayName: getCanChiDay(dayNumber),
        monthName: THANG_AM[lunarMonth] + (isLeapMonth ? " (Nhuận)" : ""),
        yearName: getCanChiYear(lunarYear),
    };
}

/**
 * Chuyển âm lịch → dương lịch
 */
export function lunarToSolar(lunarDay: number, lunarMonth: number, lunarYear: number, isLeap = false): Date {
    let a11: number, b11: number;
    if (lunarMonth < 11) {
        a11 = getLunarMonth11(lunarYear - 1, VN_TZ);
        b11 = getLunarMonth11(lunarYear, VN_TZ);
    } else {
        a11 = getLunarMonth11(lunarYear, VN_TZ);
        b11 = getLunarMonth11(lunarYear + 1, VN_TZ);
    }
    const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
    let off = lunarMonth - 11;
    if (off < 0) off += 12;
    let leapOff = 0;
    let leapMonth = 0;
    if (b11 - a11 > 365) {
        leapOff = getLeapMonthOffset(a11, VN_TZ);
        leapMonth = leapOff - 2;
        if (leapMonth < 0) leapMonth += 12;
        if (isLeap && lunarMonth !== leapMonth) {
            // fallback
        } else if (isLeap || off >= leapOff) {
            off += 1;
        }
    }
    const monthStart = getNewMoonDay(k + off, VN_TZ);
    const jd = monthStart + lunarDay - 1;
    const [d, m, y] = jdToDate(jd);
    return new Date(y, m - 1, d);
}

/* ============================================================
 * CAN CHI
 * ============================================================ */

export function getCanChiYear(lunarYear: number): string {
    return THIEN_CAN[(lunarYear + 6) % 10] + " " + DIA_CHI[(lunarYear + 8) % 12];
}

export function getCanChiMonth(lunarMonth: number, lunarYear: number): string {
    const canIdx = (lunarYear * 12 + lunarMonth + 3) % 10;
    const chiIdx = (lunarMonth + 1) % 12;
    return THIEN_CAN[canIdx] + " " + DIA_CHI[chiIdx];
}

export function getCanChiDay(jd: number): string {
    return THIEN_CAN[(jd + 9) % 10] + " " + DIA_CHI[(jd + 1) % 12];
}

export function getCanChiHour(chi: number, dayJd: number): string {
    const canIdx = ((dayJd % 10) * 2 + chi) % 10;
    return THIEN_CAN[canIdx] + " " + DIA_CHI[chi];
}

export function getCanChi(dd: number, mm: number, yy: number, hour = 0): CanChi {
    const jd = jdFromDate(dd, mm, yy);
    const lunar = solarToLunar(dd, mm, yy);
    const chiH = Math.floor((hour + 1) / 2) % 12;
    return {
        year: getCanChiYear(lunar.year),
        month: getCanChiMonth(lunar.month, lunar.year),
        day: getCanChiDay(jd),
        hour: getCanChiHour(chiH, jd),
    };
}

/* ============================================================
 * HOÀNG ĐẠO / HẮC ĐẠO
 * ============================================================ */

/** Pattern 12 giờ Hoàng Đạo theo Chi của ngày âm lịch */
const HOANG_DAO_PATTERN: Record<number, boolean[]> = {
    0: [true, false, false, true, false, false, true, false, true, false, false, true],  // Tý
    1: [false, true, false, false, true, false, false, true, false, false, true, false],  // Sửu
    2: [false, false, true, false, false, true, false, false, true, true, false, false],  // Dần
    3: [true, false, false, true, false, false, true, false, false, true, false, true],  // Mão
    4: [false, true, false, false, true, false, false, true, false, false, true, false],  // Thìn
    5: [false, false, true, false, false, true, false, false, true, true, false, false],  // Tỵ
    6: [true, false, false, true, false, false, true, false, true, false, false, true],  // Ngọ
    7: [false, true, false, false, true, false, false, true, false, false, true, false],  // Mùi
    8: [false, false, true, false, false, true, false, false, true, true, false, false],  // Thân
    9: [true, false, false, true, false, false, true, false, false, true, false, true],  // Dậu
    10: [false, true, false, false, true, false, false, true, false, false, true, false],  // Tuất
    11: [false, false, true, false, false, true, false, false, true, true, false, false],  // Hợi
};

const GIO_CHI_START = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

export function getHoangDao(lunarDay: number, lunarMonth: number, lunarYear: number): HoangDaoHour[] {
    const jd = jdFromDate(...(lunarToSolar(lunarDay, lunarMonth, lunarYear).toLocaleDateString("en-CA").split("-").map(Number) as [number, number, number]).reverse() as [number, number, number]);
    const dayChiIdx = (jd + 1) % 12;
    const pattern = HOANG_DAO_PATTERN[dayChiIdx] ?? HOANG_DAO_PATTERN[0];

    return DIA_CHI.map((chi, i) => ({
        chi,
        startHour: GIO_CHI_START[i],
        endHour: (GIO_CHI_START[i] + 2) % 24,
        isHoangDao: pattern[i],
    }));
}

/* ============================================================
 * HELPERS
 * ============================================================ */

/** Số ngày trong tháng âm lịch (29 hoặc 30) */
export function daysInLunarMonth(lunarYear: number, lunarMonth: number, isLeap = false): 29 | 30 {
    const solar = lunarToSolar(1, lunarMonth, lunarYear, isLeap);
    const d = solar.getDate(), m = solar.getMonth() + 1, y = solar.getFullYear();
    const jd1 = jdFromDate(d, m, y);

    let nextMonth = lunarMonth + 1;
    let nextYear = lunarYear;
    if (nextMonth > 12) { nextMonth = 1; nextYear++; }
    const solar2 = lunarToSolar(1, nextMonth, nextYear, false);
    const d2 = solar2.getDate(), m2 = solar2.getMonth() + 1, y2 = solar2.getFullYear();
    const jd2 = jdFromDate(d2, m2, y2);

    return (jd2 - jd1) as 29 | 30;
}

/** Tháng nhuận trong năm âm lịch (0 = không có) */
export function getLeapMonth(lunarYear: number): number {
    const a11 = getLunarMonth11(lunarYear, VN_TZ);
    const b11 = getLunarMonth11(lunarYear + 1, VN_TZ);
    if (b11 - a11 <= 365) return 0;
    const leapOff = getLeapMonthOffset(a11, VN_TZ);
    const leapMonth = leapOff - 2;
    return leapMonth < 0 ? leapMonth + 12 : leapMonth;
}
