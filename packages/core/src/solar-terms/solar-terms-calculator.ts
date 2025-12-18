/**
 * Solar Terms (Tiết Khí) Calculator
 * 24 tiết khí trong năm
 *
 * @lunar-calendar/core
 */

import type { SolarDate, SolarTerm } from '../types';
import { SOLAR_TERMS } from '../constants';

// =============================================================================
// PRE-COMPUTED SOLAR TERMS DATA
// =============================================================================

/**
 * Solar terms dates are pre-computed using astronomical algorithms
 * Each term occurs when the Sun reaches specific ecliptic longitudes
 *
 * Approximate dates (can vary by 1-2 days each year):
 * - Tiểu Hàn: ~January 5-7
 * - Đại Hàn: ~January 20-21
 * - Lập Xuân: ~February 3-5
 * - ...etc
 */

/**
 * Base dates for solar terms (average dates)
 * Index = term index (0-23)
 */
const SOLAR_TERM_BASE_DATES: { month: number; day: number }[] = [
  { month: 1, day: 6 }, // Tiểu Hàn
  { month: 1, day: 20 }, // Đại Hàn
  { month: 2, day: 4 }, // Lập Xuân
  { month: 2, day: 19 }, // Vũ Thủy
  { month: 3, day: 6 }, // Kinh Trập
  { month: 3, day: 21 }, // Xuân Phân
  { month: 4, day: 5 }, // Thanh Minh
  { month: 4, day: 20 }, // Cốc Vũ
  { month: 5, day: 6 }, // Lập Hạ
  { month: 5, day: 21 }, // Tiểu Mãn
  { month: 6, day: 6 }, // Mang Chủng
  { month: 6, day: 21 }, // Hạ Chí
  { month: 7, day: 7 }, // Tiểu Thử
  { month: 7, day: 23 }, // Đại Thử
  { month: 8, day: 7 }, // Lập Thu
  { month: 8, day: 23 }, // Xử Thử
  { month: 9, day: 8 }, // Bạch Lộ
  { month: 9, day: 23 }, // Thu Phân
  { month: 10, day: 8 }, // Hàn Lộ
  { month: 10, day: 23 }, // Sương Giáng
  { month: 11, day: 7 }, // Lập Đông
  { month: 11, day: 22 }, // Tiểu Tuyết
  { month: 12, day: 7 }, // Đại Tuyết
  { month: 12, day: 22 }, // Đông Chí
];

/**
 * Solar term descriptions
 */
const SOLAR_TERM_DESCRIPTIONS: string[] = [
  'Rét nhẹ - thời tiết lạnh nhưng chưa đến mức cực điểm',
  'Rét đậm - thời kỳ lạnh nhất trong năm',
  'Bắt đầu mùa xuân - vạn vật bắt đầu sinh trưởng',
  'Mưa xuân - mưa phùn bắt đầu xuất hiện',
  'Côn trùng thức giấc - sấm đầu mùa, côn trùng ra khỏi hang',
  'Xuân phân - ngày đêm dài bằng nhau, giữa xuân',
  'Thanh minh - trời trong sáng, thời tiết ấm áp',
  'Mưa nuôi lúa - mưa nhiều giúp cây cối phát triển',
  'Bắt đầu mùa hạ - thời tiết nóng lên',
  'Lúa bắt đầu chắc hạt',
  'Lúa trổ đòng - mùa gặt đến gần',
  'Hạ chí - ngày dài nhất năm, giữa hè',
  'Nóng nhẹ - thời tiết nóng nhưng chưa cực điểm',
  'Nóng đỉnh điểm - thời kỳ nóng nhất trong năm',
  'Bắt đầu mùa thu - thời tiết mát mẻ hơn',
  'Hết nóng - thời tiết mát dần',
  'Sương trắng - sương đêm bắt đầu xuất hiện',
  'Thu phân - ngày đêm dài bằng nhau, giữa thu',
  'Sương lạnh - thời tiết lạnh hơn, sương nhiều',
  'Sương giá - sương đọng thành giá',
  'Bắt đầu mùa đông - thời tiết lạnh',
  'Tuyết nhẹ - thời tiết lạnh, có thể có tuyết nhẹ',
  'Tuyết nặng - thời tiết rất lạnh',
  'Đông chí - ngày ngắn nhất năm, giữa đông',
];

// =============================================================================
// CALCULATION FUNCTIONS
// =============================================================================

/**
 * Calculate solar term date for a specific year
 * Uses simplified astronomical calculation
 *
 * @param year - Solar year
 * @param termIndex - Solar term index (0-23)
 * @returns Calculated date
 */
function calculateSolarTermDate(year: number, termIndex: number): SolarDate {
  const base = SOLAR_TERM_BASE_DATES[termIndex];

  // Simplified calculation - in production, use full astronomical algorithm
  // This approximation is accurate to ±1 day
  const century = Math.floor(year / 100);
  const yearInCentury = year % 100;

  // Adjustment based on year
  let dayOffset = 0;

  // Leap year adjustment
  if (termIndex >= 0 && termIndex <= 3) {
    // Jan-Feb terms
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    if (isLeapYear && termIndex >= 2) {
      dayOffset -= 1;
    }
  }

  // Century adjustment (simplified)
  if (century === 20) {
    dayOffset += Math.floor((yearInCentury - 1) / 4);
  } else if (century === 21) {
    dayOffset += Math.floor(yearInCentury / 4);
  }

  // Normalize day offset
  dayOffset = dayOffset % 2;

  let day = base.day + dayOffset;
  let month = base.month;

  // Handle month overflow
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) {
    day -= daysInMonth;
    month += 1;
  }

  return { year, month, day };
}

/**
 * Get all 24 solar terms for a year
 *
 * @param year - Solar year
 * @returns Array of 24 SolarTerm objects
 *
 * @example
 * ```typescript
 * const terms = getSolarTermsInYear(2024);
 * terms.forEach(t => console.log(t.name, t.date));
 * ```
 */
export function getSolarTermsInYear(year: number): SolarTerm[] {
  return SOLAR_TERMS.map((term, index) => ({
    index: term.index,
    name: term.name,
    chineseName: term.chineseName,
    date: calculateSolarTermDate(year, index),
    description: SOLAR_TERM_DESCRIPTIONS[index],
  }));
}

/**
 * Get the solar term that falls on or contains a specific date
 *
 * @param solar - Solar date
 * @returns SolarTerm if the date is a solar term date, null otherwise
 */
export function getSolarTermOnDate(solar: SolarDate): SolarTerm | null {
  const terms = getSolarTermsInYear(solar.year);

  for (const term of terms) {
    if (
      term.date.year === solar.year &&
      term.date.month === solar.month &&
      term.date.day === solar.day
    ) {
      return term;
    }
  }

  return null;
}

/**
 * Get the current solar term period for a date
 *
 * @param solar - Solar date
 * @returns Current solar term (the most recent one before or on this date)
 */
export function getCurrentSolarTerm(solar: SolarDate): SolarTerm {
  const terms = getSolarTermsInYear(solar.year);
  const prevYearTerms = getSolarTermsInYear(solar.year - 1);

  // Convert date to comparable number
  const dateNum = (d: SolarDate) => d.year * 10000 + d.month * 100 + d.day;
  const targetNum = dateNum(solar);

  // Find the most recent term before or on this date
  let currentTerm = prevYearTerms[23]; // Default to last term of previous year

  for (const term of terms) {
    const termNum = dateNum(term.date);
    if (termNum <= targetNum) {
      currentTerm = term;
    } else {
      break;
    }
  }

  return currentTerm;
}

/**
 * Get the next solar term after a date
 *
 * @param solar - Solar date
 * @returns Next solar term
 */
export function getNextSolarTerm(solar: SolarDate): SolarTerm {
  const terms = getSolarTermsInYear(solar.year);
  const nextYearTerms = getSolarTermsInYear(solar.year + 1);

  const dateNum = (d: SolarDate) => d.year * 10000 + d.month * 100 + d.day;
  const targetNum = dateNum(solar);

  for (const term of terms) {
    if (dateNum(term.date) > targetNum) {
      return term;
    }
  }

  // Return first term of next year
  return nextYearTerms[0];
}

/**
 * Get days until next solar term
 *
 * @param solar - Solar date
 * @returns Number of days until next solar term
 */
export function getDaysUntilNextTerm(solar: SolarDate): number {
  const nextTerm = getNextSolarTerm(solar);

  const currentDate = new Date(solar.year, solar.month - 1, solar.day);
  const termDate = new Date(
    nextTerm.date.year,
    nextTerm.date.month - 1,
    nextTerm.date.day
  );

  const diffTime = termDate.getTime() - currentDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get solar term by name
 *
 * @param name - Solar term name (Vietnamese)
 * @param year - Year to get the date for
 * @returns SolarTerm or null if not found
 */
export function getSolarTermByName(
  name: string,
  year: number
): SolarTerm | null {
  const terms = getSolarTermsInYear(year);
  return terms.find((t) => t.name === name) || null;
}
