/**
 * Can Chi (Stem-Branch) Calculator
 * Tính toán Can Chi cho năm, tháng, ngày, giờ
 *
 * @lunar-calendar/core
 */

import type { SolarDate, CanChi, Element } from '../types';
import { THIEN_CAN, DIA_CHI, NAP_AM } from '../constants';
import { toJulianDay } from '../lunar/lunar-calculator';
import { solarToLunar } from '../lunar/lunar-calculator';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Build CanChi object from can and chi indices
 */
function buildCanChi(can: number, chi: number): CanChi {
  const canInfo = THIEN_CAN[can];
  const chiInfo = DIA_CHI[chi];

  // Calculate the 60-year cycle index for Nạp Âm
  const cycleIndex = (can + chi * 6) % 60;
  const napAmIndex = Math.floor(cycleIndex / 2) % 30;
  const napAm = NAP_AM[napAmIndex];

  return {
    can,
    chi,
    canName: canInfo.name,
    chiName: chiInfo.name,
    fullName: `${canInfo.name} ${chiInfo.name}`,
    element: napAm?.element || canInfo.element,
    napAm: napAm?.name,
  };
}

/**
 * Ensure positive modulo result
 */
function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

// =============================================================================
// CAN CHI CALCULATIONS
// =============================================================================

/**
 * Get Can Chi for a lunar year
 *
 * Formula: (năm âm - 4) mod 60
 * Năm Giáp Tý = năm 4 (Công nguyên)
 *
 * @param lunarYear - Năm âm lịch
 * @returns CanChi object
 *
 * @example
 * ```typescript
 * getYearCanChi(2024);
 * // { can: 0, chi: 4, fullName: 'Giáp Thìn', element: 'moc' }
 * ```
 */
export function getYearCanChi(lunarYear: number): CanChi {
  const offset = mod(lunarYear - 4, 60);
  const can = offset % 10;
  const chi = offset % 12;
  return buildCanChi(can, chi);
}

/**
 * Get Can Chi for a lunar month
 *
 * Can tháng phụ thuộc vào Can năm:
 * - Năm Giáp, Kỷ: tháng Giêng là Bính Dần
 * - Năm Ất, Canh: tháng Giêng là Mậu Dần
 * - Năm Bính, Tân: tháng Giêng là Canh Dần
 * - Năm Đinh, Nhâm: tháng Giêng là Nhâm Dần
 * - Năm Mậu, Quý: tháng Giêng là Giáp Dần
 *
 * Chi tháng cố định: tháng Giêng = Dần (index 2)
 *
 * @param lunarYear - Năm âm lịch
 * @param lunarMonth - Tháng âm lịch (1-12)
 * @returns CanChi object
 */
export function getMonthCanChi(lunarYear: number, lunarMonth: number): CanChi {
  const yearCan = mod(lunarYear - 4, 10);

  // Bảng tra Can tháng Giêng theo Can năm
  // Giáp/Kỷ -> Bính (2), Ất/Canh -> Mậu (4), etc.
  const monthCanStart = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  const startCan = monthCanStart[yearCan];

  const can = mod(startCan + lunarMonth - 1, 10);
  const chi = mod(lunarMonth + 1, 12); // Tháng 1 = Dần (index 2)

  return buildCanChi(can, chi);
}

/**
 * Get Can Chi for a solar day
 *
 * Based on Julian Day Number:
 * Can = (JD + 9) mod 10
 * Chi = (JD + 1) mod 12
 *
 * @param solar - Solar date
 * @returns CanChi object
 *
 * @example
 * ```typescript
 * getDayCanChi({ year: 2024, month: 2, day: 10 });
 * // Returns Can Chi for Tết Giáp Thìn
 * ```
 */
export function getDayCanChi(solar: SolarDate): CanChi {
  const jd = toJulianDay(solar);
  const can = mod(jd + 9, 10);
  const chi = mod(jd + 1, 12);
  return buildCanChi(can, chi);
}

/**
 * Get Can Chi for an hour
 *
 * Chi giờ cố định theo 12 canh:
 * - Tý: 23h-1h
 * - Sửu: 1h-3h
 * - Dần: 3h-5h
 * ...
 *
 * Can giờ phụ thuộc Can ngày:
 * Can giờ Tý = (Can ngày * 2) mod 10
 *
 * @param dayCan - Can của ngày (0-9)
 * @param hourChi - Chi của giờ (0-11)
 * @returns CanChi object
 */
export function getHourCanChi(dayCan: number, hourChi: number): CanChi {
  // Can giờ Tý của mỗi Can ngày
  // Ngày Giáp, Kỷ: giờ Tý là Giáp Tý
  // Ngày Ất, Canh: giờ Tý là Bính Tý
  // Ngày Bính, Tân: giờ Tý là Mậu Tý
  // Ngày Đinh, Nhâm: giờ Tý là Canh Tý
  // Ngày Mậu, Quý: giờ Tý là Nhâm Tý
  const hourCanTyStart = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];
  const startCan = hourCanTyStart[dayCan];

  const can = mod(startCan + hourChi, 10);
  return buildCanChi(can, hourChi);
}

/**
 * Get Chi (earthly branch) from hour of day
 *
 * @param hour - Hour (0-23)
 * @returns Chi index (0-11)
 */
export function getChiFromHour(hour: number): number {
  // 23-1: Tý (0)
  // 1-3: Sửu (1)
  // 3-5: Dần (2)
  // ...
  if (hour === 23) return 0;
  return Math.floor((hour + 1) / 2);
}

/**
 * Get hour range from Chi
 *
 * @param chi - Chi index (0-11)
 * @returns { start, end } hour range
 */
export function getHourRangeFromChi(chi: number): { start: number; end: number } {
  if (chi === 0) {
    return { start: 23, end: 1 };
  }
  const start = chi * 2 - 1;
  const end = chi * 2 + 1;
  return { start, end };
}

/**
 * Get all Can Chi information for a solar date
 *
 * @param solar - Solar date
 * @returns Object with year, month, day Can Chi
 */
export function getFullCanChi(solar: SolarDate): {
  year: CanChi;
  month: CanChi;
  day: CanChi;
} {
  const lunar = solarToLunar(solar);

  return {
    year: getYearCanChi(lunar.year),
    month: getMonthCanChi(lunar.year, lunar.month),
    day: getDayCanChi(solar),
  };
}

/**
 * Get element relationship between two elements
 *
 * @param element1 - First element
 * @param element2 - Second element
 * @returns Relationship type
 */
export function getElementRelationship(
  element1: Element,
  element2: Element
): 'sinh' | 'khac' | 'dong' {
  // Tương sinh: Mộc -> Hỏa -> Thổ -> Kim -> Thủy -> Mộc
  const sinhCycle: Element[] = ['moc', 'hoa', 'tho', 'kim', 'thuy'];
  const idx1 = sinhCycle.indexOf(element1);
  const idx2 = sinhCycle.indexOf(element2);

  if (element1 === element2) return 'dong';
  if (mod(idx1 + 1, 5) === idx2) return 'sinh';
  return 'khac';
}
