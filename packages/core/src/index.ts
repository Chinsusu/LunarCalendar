/**
 * @lunar-calendar/core
 *
 * Vietnamese Lunar Calendar Core Library
 * Offline-first calculations for lunar calendar, Can Chi, Hoang Dao, Solar Terms, and Sunrise/Sunset
 *
 * @example
 * ```typescript
 * import {
 *   solarToLunar,
 *   lunarToSolar,
 *   getYearCanChi,
 *   getDayInfo,
 *   getSunTimes,
 *   VIETNAM_LOCATIONS
 * } from '@lunar-calendar/core';
 *
 * // Convert today to lunar
 * const lunar = solarToLunar({ year: 2024, month: 2, day: 10 });
 * console.log(lunar.monthName); // "Giêng"
 *
 * // Get full day info
 * const dayInfo = getDayInfo({ year: 2024, month: 2, day: 10 });
 * console.log(dayInfo.canChiYear.fullName); // "Giáp Thìn"
 *
 * // Get sun times for Hanoi
 * const sun = getSunTimes({ year: 2024, month: 6, day: 21 }, VIETNAM_LOCATIONS.hanoi);
 * console.log(sun.sunrise); // "05:15"
 * ```
 */

// =============================================================================
// TYPES
// =============================================================================

export type {
  SolarDate,
  LunarDate,
  Element,
  ThienCan,
  DiaChi,
  CanChi,
  HourType,
  HoangDaoStar,
  HourInfo,
  Truc,
  TrucInfo,
  SolarTerm,
  Location,
  SunTimes,
  DayInfo,
} from './types';

export { LunarCalendarError, ErrorCode, ELEMENT_NAMES } from './types';

// =============================================================================
// CONSTANTS
// =============================================================================

export {
  THIEN_CAN,
  DIA_CHI,
  LUNAR_MONTH_NAMES,
  HOANG_DAO_STARS,
  HOUR_STAR_START_TABLE,
  TRUC_INFO,
  SOLAR_TERMS,
} from './constants';

// =============================================================================
// LUNAR CALENDAR
// =============================================================================

export {
  solarToLunar,
  lunarToSolar,
  validateSolarDate,
  validateLunarDate,
  isLeapYear,
  getDaysInSolarMonth,
  toJulianDay,
  fromJulianDay,
  getLunarYearInfo,
} from './lunar/lunar-calculator';

// =============================================================================
// CAN CHI
// =============================================================================

export {
  getYearCanChi,
  getMonthCanChi,
  getDayCanChi,
  getHourCanChi,
  getChiFromHour,
  getHourRangeFromChi,
  getFullCanChi,
  getElementRelationship,
} from './canchi/canchi-calculator';

// =============================================================================
// HOANG DAO
// =============================================================================

export {
  getHoangDaoHours,
  getGoodHours,
  getBadHours,
  isHoangDaoHour,
  getTruc,
  isHoangDaoDay,
  getDayQuality,
  findHoangDaoDaysInMonth,
  findGoodDaysFor,
  formatHourRange,
} from './hoangdao/hoangdao-service';

// =============================================================================
// SOLAR TERMS
// =============================================================================

export {
  getSolarTermsInYear,
  getSolarTermOnDate,
  getCurrentSolarTerm,
  getNextSolarTerm,
  getDaysUntilNextTerm,
  getSolarTermByName,
} from './solar-terms/solar-terms-calculator';

// =============================================================================
// SUN TIMES
// =============================================================================

export {
  getSunTimes,
  getSunTimesHanoi,
  getDayLength,
  isSunUp,
  VIETNAM_LOCATIONS,
} from './suncalc/suncalc-service';

// =============================================================================
// COMBINED DAY INFO
// =============================================================================

import type { SolarDate, DayInfo, Location } from './types';
import { solarToLunar } from './lunar/lunar-calculator';
import { getFullCanChi } from './canchi/canchi-calculator';
import { getHoangDaoHours, getTruc, isHoangDaoDay } from './hoangdao/hoangdao-service';
import { getSolarTermOnDate } from './solar-terms/solar-terms-calculator';
import { getSunTimes, VIETNAM_LOCATIONS } from './suncalc/suncalc-service';

/**
 * Get complete information for a date
 *
 * @param solar - Solar date
 * @param location - Optional location for sun times (default: Hanoi)
 * @returns Complete DayInfo object
 *
 * @example
 * ```typescript
 * const info = getDayInfo({ year: 2024, month: 2, day: 10 });
 *
 * console.log(info.lunar.monthName);        // "Giêng"
 * console.log(info.canChiYear.fullName);    // "Giáp Thìn"
 * console.log(info.isHoangDaoDay);          // true/false
 * console.log(info.sunTimes?.sunrise);      // "06:15"
 * ```
 */
export function getDayInfo(solar: SolarDate, location?: Location): DayInfo {
  const lunar = solarToLunar(solar);
  const canChi = getFullCanChi(solar);
  const hours = getHoangDaoHours(solar);
  const truc = getTruc(solar);
  const solarTerm = getSolarTermOnDate(solar);
  const loc = location || VIETNAM_LOCATIONS.hanoi;
  const sunTimes = getSunTimes(solar, loc);

  return {
    solar,
    lunar,
    canChiYear: canChi.year,
    canChiMonth: canChi.month,
    canChiDay: canChi.day,
    solarTerm: solarTerm || undefined,
    truc,
    hours,
    isHoangDaoDay: isHoangDaoDay(solar),
    sunTimes,
  };
}

/**
 * Get calendar data for a month
 *
 * @param year - Solar year
 * @param month - Solar month (1-12)
 * @param location - Optional location for sun times
 * @returns Array of DayInfo for each day in the month
 */
export function getMonthCalendar(
  year: number,
  month: number,
  location?: Location
): DayInfo[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const result: DayInfo[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    result.push(getDayInfo({ year, month, day }, location));
  }

  return result;
}

/**
 * Get today's information
 *
 * @param location - Optional location for sun times
 * @returns DayInfo for today
 */
export function getTodayInfo(location?: Location): DayInfo {
  const now = new Date();
  return getDayInfo(
    {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    },
    location
  );
}
