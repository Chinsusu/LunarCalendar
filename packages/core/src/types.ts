/**
 * Core Types for Vietnamese Lunar Calendar
 * @lunar-calendar/core
 */

// =============================================================================
// DATE TYPES
// =============================================================================

/**
 * Ngày dương lịch (Solar/Gregorian Date)
 */
export interface SolarDate {
  /** Năm (1900-2100) */
  year: number;
  /** Tháng (1-12) */
  month: number;
  /** Ngày (1-31) */
  day: number;
}

/**
 * Ngày âm lịch (Lunar Date)
 */
export interface LunarDate {
  /** Năm âm lịch (1900-2100) */
  year: number;
  /** Tháng âm (1-12, hoặc 1-13 nếu có tháng nhuận) */
  month: number;
  /** Ngày âm (1-29 hoặc 1-30) */
  day: number;
  /** Có phải tháng nhuận không */
  isLeapMonth: boolean;
  /** Tên tháng tiếng Việt */
  monthName: string;
}

// =============================================================================
// CAN CHI (STEM-BRANCH) TYPES
// =============================================================================

/**
 * Ngũ hành (Five Elements)
 */
export type Element = 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho';

/**
 * Tên Ngũ hành tiếng Việt
 */
export const ELEMENT_NAMES: Record<Element, string> = {
  kim: 'Kim',
  moc: 'Mộc',
  thuy: 'Thủy',
  hoa: 'Hỏa',
  tho: 'Thổ',
};

/**
 * Thiên Can (Heavenly Stem)
 */
export interface ThienCan {
  /** Index 0-9 */
  index: number;
  /** Tên: Giáp, Ất, Bính... */
  name: string;
  /** Ngũ hành */
  element: Element;
  /** Âm/Dương (true = Âm) */
  yin: boolean;
}

/**
 * Địa Chi (Earthly Branch)
 */
export interface DiaChi {
  /** Index 0-11 */
  index: number;
  /** Tên: Tý, Sửu, Dần... */
  name: string;
  /** Con giáp */
  animal: string;
  /** Ngũ hành */
  element: Element;
}

/**
 * Can Chi (Stem-Branch combination)
 */
export interface CanChi {
  /** Thiên Can index (0-9) */
  can: number;
  /** Địa Chi index (0-11) */
  chi: number;
  /** Tên Can */
  canName: string;
  /** Tên Chi */
  chiName: string;
  /** Tên đầy đủ: "Giáp Tý" */
  fullName: string;
  /** Ngũ hành của năm/tháng/ngày */
  element: Element;
  /** Nạp âm (for year calculation) */
  napAm?: string;
}

// =============================================================================
// HOANG DAO (AUSPICIOUS) TYPES
// =============================================================================

/**
 * Loại giờ: Hoàng đạo (tốt) hoặc Hắc đạo (xấu)
 */
export type HourType = 'hoangdao' | 'hacdao';

/**
 * 12 Sao theo giờ
 */
export interface HoangDaoStar {
  /** Tên sao */
  name: string;
  /** Loại */
  type: HourType;
  /** Mô tả ý nghĩa */
  meaning: string;
}

/**
 * Thông tin một canh giờ
 */
export interface HourInfo {
  /** Địa Chi của giờ (0-11) */
  chi: number;
  /** Tên Chi: "Tý", "Sửu"... */
  chiName: string;
  /** Giờ bắt đầu (0-23) */
  startHour: number;
  /** Giờ kết thúc (0-23) */
  endHour: number;
  /** Loại: hoàng đạo hoặc hắc đạo */
  type: HourType;
  /** Tên sao hoàng đạo/hắc đạo */
  starName: string;
  /** Can Chi đầy đủ của giờ */
  canChi: CanChi;
}

/**
 * 12 Trực (Day Qualities)
 */
export type Truc =
  | 'kien'
  | 'tru'
  | 'man'
  | 'binh'
  | 'dinh'
  | 'chap'
  | 'pha'
  | 'nguy'
  | 'thanh'
  | 'thu'
  | 'khai'
  | 'be';

export interface TrucInfo {
  /** ID */
  id: Truc;
  /** Tên tiếng Việt */
  name: string;
  /** Hoàng đạo hay Hắc đạo */
  type: HourType;
  /** Việc nên làm */
  goodFor: string[];
  /** Việc kiêng */
  badFor: string[];
}

// =============================================================================
// SOLAR TERMS (TIẾT KHÍ) TYPES
// =============================================================================

/**
 * Tiết khí (Solar Term)
 */
export interface SolarTerm {
  /** Index 0-23 */
  index: number;
  /** Tên tiếng Việt */
  name: string;
  /** Tên Hán Việt */
  chineseName: string;
  /** Ngày dương lịch (approximate) */
  date: SolarDate;
  /** Mô tả */
  description: string;
}

// =============================================================================
// SUN TIMES TYPES
// =============================================================================

/**
 * Tọa độ địa lý
 */
export interface Location {
  /** Vĩ độ (latitude) */
  latitude: number;
  /** Kinh độ (longitude) */
  longitude: number;
  /** Tên địa điểm */
  name?: string;
  /** Múi giờ (default: 7 for Vietnam) */
  timezone?: number;
}

/**
 * Thời gian mặt trời
 */
export interface SunTimes {
  /** Bình minh */
  sunrise: string;
  /** Hoàng hôn */
  sunset: string;
  /** Giữa trưa */
  solarNoon: string;
  /** Bình minh dân dụng (civil dawn) */
  civilDawn?: string;
  /** Hoàng hôn dân dụng (civil dusk) */
  civilDusk?: string;
}

// =============================================================================
// COMBINED DAY INFO
// =============================================================================

/**
 * Thông tin đầy đủ một ngày
 */
export interface DayInfo {
  /** Ngày dương lịch */
  solar: SolarDate;
  /** Ngày âm lịch */
  lunar: LunarDate;
  /** Can Chi năm */
  canChiYear: CanChi;
  /** Can Chi tháng */
  canChiMonth: CanChi;
  /** Can Chi ngày */
  canChiDay: CanChi;
  /** Tiết khí (nếu có) */
  solarTerm?: SolarTerm;
  /** Trực của ngày */
  truc: TrucInfo;
  /** 12 canh giờ với thông tin hoàng/hắc đạo */
  hours: HourInfo[];
  /** Ngày có phải hoàng đạo không */
  isHoangDaoDay: boolean;
  /** Thời gian mặt trời (nếu có location) */
  sunTimes?: SunTimes;
}

// =============================================================================
// ERROR TYPES
// =============================================================================

export enum ErrorCode {
  INVALID_DATE = 'INVALID_DATE',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  INVALID_LUNAR_DATE = 'INVALID_LUNAR_DATE',
  INVALID_LOCATION = 'INVALID_LOCATION',
}

export class LunarCalendarError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public details?: unknown
  ) {
    super(message);
    this.name = 'LunarCalendarError';
  }
}
