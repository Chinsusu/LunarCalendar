/**
 * Lunar Calendar Calculator
 * Chuyển đổi giữa âm lịch và dương lịch
 *
 * @lunar-calendar/core
 */

import type { SolarDate, LunarDate } from '../types';
import { LunarCalendarError, ErrorCode } from '../types';
import {
  LUNAR_INFO,
  NEW_YEAR_OFFSETS,
  MIN_YEAR,
  MAX_YEAR,
  JULIAN_1900_JAN_1,
  getLunarMonthDays,
  getLeapMonth,
  getLeapMonthDays,
  getLunarYearDays,
} from '../data/lunar-data';
import { LUNAR_MONTH_NAMES } from '../constants';

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate solar date
 */
export function validateSolarDate(date: SolarDate): void {
  const { year, month, day } = date;

  if (year < MIN_YEAR || year > MAX_YEAR) {
    throw new LunarCalendarError(
      `Year ${year} is out of supported range (${MIN_YEAR}-${MAX_YEAR})`,
      ErrorCode.OUT_OF_RANGE
    );
  }

  if (month < 1 || month > 12) {
    throw new LunarCalendarError(
      `Month ${month} is invalid (must be 1-12)`,
      ErrorCode.INVALID_DATE
    );
  }

  const daysInMonth = getDaysInSolarMonth(year, month);
  if (day < 1 || day > daysInMonth) {
    throw new LunarCalendarError(
      `Day ${day} is invalid for month ${month}/${year}`,
      ErrorCode.INVALID_DATE
    );
  }
}

/**
 * Validate lunar date
 */
export function validateLunarDate(date: LunarDate): void {
  const { year, month, day, isLeapMonth } = date;

  if (year < MIN_YEAR || year > MAX_YEAR) {
    throw new LunarCalendarError(
      `Year ${year} is out of supported range (${MIN_YEAR}-${MAX_YEAR})`,
      ErrorCode.OUT_OF_RANGE
    );
  }

  if (month < 1 || month > 12) {
    throw new LunarCalendarError(
      `Month ${month} is invalid (must be 1-12)`,
      ErrorCode.INVALID_LUNAR_DATE
    );
  }

  const yearInfo = LUNAR_INFO[year - MIN_YEAR];
  const leapMonth = getLeapMonth(yearInfo);

  if (isLeapMonth && leapMonth !== month) {
    throw new LunarCalendarError(
      `Month ${month} is not a leap month in year ${year}`,
      ErrorCode.INVALID_LUNAR_DATE
    );
  }

  const daysInMonth = isLeapMonth
    ? getLeapMonthDays(yearInfo)
    : getLunarMonthDays(yearInfo, month);

  if (day < 1 || day > daysInMonth) {
    throw new LunarCalendarError(
      `Day ${day} is invalid for lunar month ${month}/${year}`,
      ErrorCode.INVALID_LUNAR_DATE
    );
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if a year is a leap year (solar calendar)
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get number of days in a solar month
 */
export function getDaysInSolarMonth(year: number, month: number): number {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }
  return days[month - 1];
}

/**
 * Convert solar date to Julian Day Number
 */
export function toJulianDay(date: SolarDate): number {
  const { year, month, day } = date;

  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Convert Julian Day Number to solar date
 */
export function fromJulianDay(jd: number): SolarDate {
  let l = jd + 68569;
  let n = Math.floor((4 * l) / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  let i = Math.floor((4000 * (l + 1)) / 1461001);
  l = l - Math.floor((1461 * i) / 4) + 31;
  let j = Math.floor((80 * l) / 2447);
  let day = l - Math.floor((2447 * j) / 80);
  l = Math.floor(j / 11);
  let month = j + 2 - 12 * l;
  let year = 100 * (n - 49) + i + l;

  return { year, month, day };
}

/**
 * Get days from start of year to a date
 */
function getDayOfYear(date: SolarDate): number {
  const { year, month, day } = date;
  let days = day;
  for (let m = 1; m < month; m++) {
    days += getDaysInSolarMonth(year, m);
  }
  return days;
}

// =============================================================================
// MAIN CONVERSION FUNCTIONS
// =============================================================================

/**
 * Convert solar date to lunar date
 *
 * @param solar - Solar (Gregorian) date
 * @returns Lunar date
 *
 * @example
 * ```typescript
 * const lunar = solarToLunar({ year: 2024, month: 2, day: 10 });
 * // { year: 2024, month: 1, day: 1, isLeapMonth: false, monthName: 'Giêng' }
 * ```
 */
export function solarToLunar(solar: SolarDate): LunarDate {
  validateSolarDate(solar);

  const { year, month, day } = solar;

  // Calculate days from Jan 1 of the same year
  const dayOfYear = getDayOfYear(solar);

  // Get Lunar New Year offset for this year
  const newYearOffset = NEW_YEAR_OFFSETS[year - MIN_YEAR];

  // If before Lunar New Year, we're in previous lunar year
  if (dayOfYear <= newYearOffset) {
    // Calculate days from Lunar New Year of previous year
    const prevYearInfo = LUNAR_INFO[year - 1 - MIN_YEAR];
    const prevNewYearOffset = NEW_YEAR_OFFSETS[year - 1 - MIN_YEAR];

    // Days in previous solar year
    const daysInPrevYear = isLeapYear(year - 1) ? 366 : 365;

    // Offset from previous Lunar New Year
    const offset = daysInPrevYear - prevNewYearOffset + dayOfYear;

    return findLunarDateFromOffset(year - 1, offset, prevYearInfo);
  }

  // After Lunar New Year, in current lunar year
  const offset = dayOfYear - newYearOffset;
  const yearInfo = LUNAR_INFO[year - MIN_YEAR];

  return findLunarDateFromOffset(year, offset, yearInfo);
}

/**
 * Find lunar date from offset within lunar year
 */
function findLunarDateFromOffset(
  lunarYear: number,
  offset: number,
  yearInfo: number
): LunarDate {
  const leapMonth = getLeapMonth(yearInfo);
  let remainingDays = offset;
  let month = 1;
  let isLeapMonth = false;

  // Iterate through months
  for (let m = 1; m <= 12; m++) {
    // Regular month
    const monthDays = getLunarMonthDays(yearInfo, m);
    if (remainingDays <= monthDays) {
      month = m;
      break;
    }
    remainingDays -= monthDays;

    // Leap month (comes after the regular month)
    if (leapMonth === m) {
      const leapDays = getLeapMonthDays(yearInfo);
      if (remainingDays <= leapDays) {
        month = m;
        isLeapMonth = true;
        break;
      }
      remainingDays -= leapDays;
    }

    month = m + 1;
  }

  // Handle edge case where we've gone past month 12
  if (month > 12) {
    month = 12;
  }

  return {
    year: lunarYear,
    month,
    day: remainingDays,
    isLeapMonth,
    monthName: LUNAR_MONTH_NAMES[month - 1],
  };
}

/**
 * Convert lunar date to solar date
 *
 * @param lunar - Lunar date
 * @returns Solar (Gregorian) date
 *
 * @example
 * ```typescript
 * const solar = lunarToSolar({
 *   year: 2024,
 *   month: 1,
 *   day: 1,
 *   isLeapMonth: false,
 *   monthName: 'Giêng'
 * });
 * // { year: 2024, month: 2, day: 10 }
 * ```
 */
export function lunarToSolar(lunar: LunarDate): SolarDate {
  validateLunarDate(lunar);

  const { year, month, day, isLeapMonth } = lunar;
  const yearInfo = LUNAR_INFO[year - MIN_YEAR];
  const leapMonth = getLeapMonth(yearInfo);

  // Calculate days from start of lunar year
  let offset = 0;

  for (let m = 1; m < month; m++) {
    offset += getLunarMonthDays(yearInfo, m);
    // Add leap month days if it comes before target month
    if (leapMonth === m) {
      offset += getLeapMonthDays(yearInfo);
    }
  }

  // If target is leap month, add the regular month days first
  if (isLeapMonth) {
    offset += getLunarMonthDays(yearInfo, month);
  }

  offset += day;

  // Get solar date from Lunar New Year offset
  const newYearOffset = NEW_YEAR_OFFSETS[year - MIN_YEAR];
  const jd = JULIAN_1900_JAN_1 + (year - MIN_YEAR) * 365;

  // Calculate days from Jan 1 of solar year
  const solarDayOfYear = newYearOffset + offset;

  // Handle year boundary
  const daysInYear = isLeapYear(year) ? 366 : 365;

  if (solarDayOfYear > daysInYear) {
    // Goes into next year
    const remainingDays = solarDayOfYear - daysInYear;
    return dayOfYearToSolarDate(year + 1, remainingDays);
  }

  return dayOfYearToSolarDate(year, solarDayOfYear);
}

/**
 * Convert day of year to solar date
 */
function dayOfYearToSolarDate(year: number, dayOfYear: number): SolarDate {
  let remaining = dayOfYear;
  let month = 1;

  while (month <= 12) {
    const daysInMonth = getDaysInSolarMonth(year, month);
    if (remaining <= daysInMonth) {
      break;
    }
    remaining -= daysInMonth;
    month++;
  }

  return { year, month, day: remaining };
}

/**
 * Get lunar year info
 *
 * @param year - Lunar year
 * @returns Object with year info
 */
export function getLunarYearInfo(year: number): {
  totalDays: number;
  leapMonth: number;
  months: { month: number; days: number; isLeap: boolean }[];
} {
  if (year < MIN_YEAR || year > MAX_YEAR) {
    throw new LunarCalendarError(
      `Year ${year} is out of supported range`,
      ErrorCode.OUT_OF_RANGE
    );
  }

  const yearInfo = LUNAR_INFO[year - MIN_YEAR];
  const leapMonth = getLeapMonth(yearInfo);
  const months: { month: number; days: number; isLeap: boolean }[] = [];

  for (let m = 1; m <= 12; m++) {
    months.push({
      month: m,
      days: getLunarMonthDays(yearInfo, m),
      isLeap: false,
    });

    if (leapMonth === m) {
      months.push({
        month: m,
        days: getLeapMonthDays(yearInfo),
        isLeap: true,
      });
    }
  }

  return {
    totalDays: getLunarYearDays(yearInfo),
    leapMonth,
    months,
  };
}
