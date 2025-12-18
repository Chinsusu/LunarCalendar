/**
 * Hoàng Đạo / Hắc Đạo Service
 * Tính toán giờ hoàng đạo, hắc đạo, trực
 *
 * @lunar-calendar/core
 */

import type { SolarDate, HourInfo, TrucInfo, HourType } from '../types';
import {
  HOANG_DAO_STARS,
  HOUR_STAR_START_TABLE,
  TRUC_INFO,
  DIA_CHI,
} from '../constants';
import {
  getDayCanChi,
  getHourCanChi,
  getHourRangeFromChi,
} from '../canchi/canchi-calculator';
import { solarToLunar } from '../lunar/lunar-calculator';

// =============================================================================
// HOÀNG ĐẠO GIỜ (HOUR STARS)
// =============================================================================

/**
 * Get all 12 hour information for a day
 *
 * @param solar - Solar date
 * @returns Array of 12 HourInfo objects
 *
 * @example
 * ```typescript
 * const hours = getHoangDaoHours({ year: 2024, month: 2, day: 10 });
 * hours.forEach(h => console.log(h.chiName, h.type, h.starName));
 * ```
 */
export function getHoangDaoHours(solar: SolarDate): HourInfo[] {
  const dayCanChi = getDayCanChi(solar);
  const dayChi = dayCanChi.chi;
  const dayCan = dayCanChi.can;

  // Get starting star index for hour Tý based on day's Chi
  const startStarIndex = HOUR_STAR_START_TABLE[dayChi];

  const hours: HourInfo[] = [];

  for (let hourChi = 0; hourChi < 12; hourChi++) {
    const starIndex = (startStarIndex + hourChi) % 12;
    const star = HOANG_DAO_STARS[starIndex];
    const hourRange = getHourRangeFromChi(hourChi);
    const hourCanChi = getHourCanChi(dayCan, hourChi);

    hours.push({
      chi: hourChi,
      chiName: DIA_CHI[hourChi].name,
      startHour: hourRange.start,
      endHour: hourRange.end,
      type: star.type,
      starName: star.name,
      canChi: hourCanChi,
    });
  }

  return hours;
}

/**
 * Get hoàng đạo hours only
 *
 * @param solar - Solar date
 * @returns Array of hoàng đạo HourInfo objects
 */
export function getGoodHours(solar: SolarDate): HourInfo[] {
  return getHoangDaoHours(solar).filter((h) => h.type === 'hoangdao');
}

/**
 * Get hắc đạo hours only
 *
 * @param solar - Solar date
 * @returns Array of hắc đạo HourInfo objects
 */
export function getBadHours(solar: SolarDate): HourInfo[] {
  return getHoangDaoHours(solar).filter((h) => h.type === 'hacdao');
}

/**
 * Check if current hour is hoàng đạo
 *
 * @param solar - Solar date
 * @param hour - Hour (0-23)
 * @returns boolean
 */
export function isHoangDaoHour(solar: SolarDate, hour: number): boolean {
  const hours = getHoangDaoHours(solar);
  const chi = hour === 23 ? 0 : Math.floor((hour + 1) / 2);
  return hours[chi].type === 'hoangdao';
}

// =============================================================================
// TRỰC (DAY QUALITY)
// =============================================================================

/**
 * Get Trực (day quality) for a date
 *
 * Trực được tính dựa trên Chi ngày và Chi tháng:
 * - Tháng Giêng (Dần): ngày Dần là Kiến
 * - Tháng Hai (Mão): ngày Mão là Kiến
 * ...
 *
 * @param solar - Solar date
 * @returns TrucInfo object
 */
export function getTruc(solar: SolarDate): TrucInfo {
  const lunar = solarToLunar(solar);
  const dayCanChi = getDayCanChi(solar);

  // Chi tháng (tháng Giêng = Dần = 2)
  const monthChi = (lunar.month + 1) % 12;

  // Chi ngày
  const dayChi = dayCanChi.chi;

  // Trực index = (Chi ngày - Chi tháng + 12) mod 12
  const trucIndex = (dayChi - monthChi + 12) % 12;

  return TRUC_INFO[trucIndex];
}

/**
 * Check if a day is hoàng đạo day (based on Trực)
 *
 * Hoàng đạo days: Trừ, Định, Chấp, Thành, Khai
 * Hắc đạo days: Kiến, Mãn, Bình, Phá, Nguy, Thu, Bế
 *
 * @param solar - Solar date
 * @returns boolean
 */
export function isHoangDaoDay(solar: SolarDate): boolean {
  const truc = getTruc(solar);
  return truc.type === 'hoangdao';
}

/**
 * Get day quality summary
 *
 * @param solar - Solar date
 * @returns Summary object
 */
export function getDayQuality(solar: SolarDate): {
  truc: TrucInfo;
  isHoangDaoDay: boolean;
  hoangDaoHours: HourInfo[];
  hacDaoHours: HourInfo[];
} {
  const truc = getTruc(solar);
  const hours = getHoangDaoHours(solar);

  return {
    truc,
    isHoangDaoDay: truc.type === 'hoangdao',
    hoangDaoHours: hours.filter((h) => h.type === 'hoangdao'),
    hacDaoHours: hours.filter((h) => h.type === 'hacdao'),
  };
}

// =============================================================================
// SEARCH FUNCTIONS
// =============================================================================

/**
 * Find hoàng đạo days in a month
 *
 * @param year - Solar year
 * @param month - Solar month
 * @returns Array of dates that are hoàng đạo days
 */
export function findHoangDaoDaysInMonth(
  year: number,
  month: number
): SolarDate[] {
  const result: SolarDate[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = { year, month, day };
    if (isHoangDaoDay(date)) {
      result.push(date);
    }
  }

  return result;
}

/**
 * Find days good for a specific activity
 *
 * @param year - Solar year
 * @param month - Solar month
 * @param activity - Activity to search for (e.g., 'Kết hôn', 'Khai trương')
 * @returns Array of dates good for the activity
 */
export function findGoodDaysFor(
  year: number,
  month: number,
  activity: string
): SolarDate[] {
  const result: SolarDate[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = { year, month, day };
    const truc = getTruc(date);

    if (truc.goodFor.some((g) => g.toLowerCase().includes(activity.toLowerCase()))) {
      result.push(date);
    }
  }

  return result;
}

/**
 * Format hour range for display
 *
 * @param hour - HourInfo object
 * @returns Formatted string like "23:00-01:00"
 */
export function formatHourRange(hour: HourInfo): string {
  const formatH = (h: number) => h.toString().padStart(2, '0');
  return `${formatH(hour.startHour)}:00-${formatH(hour.endHour)}:00`;
}
