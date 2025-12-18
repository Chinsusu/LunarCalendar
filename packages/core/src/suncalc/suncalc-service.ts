/**
 * Sun Times Calculator (SunCalc)
 * Tính toán giờ mặt trời mọc/lặn theo vị trí địa lý
 *
 * Based on: Jean Meeus - Astronomical Algorithms
 *
 * @lunar-calendar/core
 */

import type { SolarDate, Location, SunTimes } from '../types';
import { LunarCalendarError, ErrorCode } from '../types';
import { toJulianDay } from '../lunar/lunar-calculator';

// =============================================================================
// CONSTANTS
// =============================================================================

const PI = Math.PI;
const RAD = PI / 180;
const DEG = 180 / PI;

// Standard altitude for sunrise/sunset
const SUNRISE_SUNSET_ALTITUDE = -0.833; // degrees

// Civil twilight altitude
const CIVIL_TWILIGHT_ALTITUDE = -6; // degrees

// =============================================================================
// DEFAULT LOCATIONS (Vietnam)
// =============================================================================

export const VIETNAM_LOCATIONS: Record<string, Location> = {
  hanoi: {
    latitude: 21.0285,
    longitude: 105.8542,
    name: 'Hà Nội',
    timezone: 7,
  },
  hochiminh: {
    latitude: 10.8231,
    longitude: 106.6297,
    name: 'TP. Hồ Chí Minh',
    timezone: 7,
  },
  danang: {
    latitude: 16.0544,
    longitude: 108.2022,
    name: 'Đà Nẵng',
    timezone: 7,
  },
  haiphong: {
    latitude: 20.8449,
    longitude: 106.6881,
    name: 'Hải Phòng',
    timezone: 7,
  },
  cantho: {
    latitude: 10.0452,
    longitude: 105.7469,
    name: 'Cần Thơ',
    timezone: 7,
  },
  hue: {
    latitude: 16.4637,
    longitude: 107.5909,
    name: 'Huế',
    timezone: 7,
  },
  nhatrang: {
    latitude: 12.2388,
    longitude: 109.1967,
    name: 'Nha Trang',
    timezone: 7,
  },
  dalat: {
    latitude: 11.9404,
    longitude: 108.4583,
    name: 'Đà Lạt',
    timezone: 7,
  },
  vungtau: {
    latitude: 10.346,
    longitude: 107.0843,
    name: 'Vũng Tàu',
    timezone: 7,
  },
  quynhon: {
    latitude: 13.7829,
    longitude: 109.2196,
    name: 'Quy Nhơn',
    timezone: 7,
  },
};

// =============================================================================
// MATH UTILITIES
// =============================================================================

function sin(deg: number): number {
  return Math.sin(deg * RAD);
}

function cos(deg: number): number {
  return Math.cos(deg * RAD);
}

function tan(deg: number): number {
  return Math.tan(deg * RAD);
}

function asin(x: number): number {
  return Math.asin(x) * DEG;
}

function acos(x: number): number {
  return Math.acos(x) * DEG;
}

function atan2(y: number, x: number): number {
  return Math.atan2(y, x) * DEG;
}

/**
 * Normalize angle to 0-360 range
 */
function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

// =============================================================================
// ASTRONOMICAL CALCULATIONS
// =============================================================================

/**
 * Calculate Julian Century from Julian Day
 */
function getJulianCentury(jd: number): number {
  return (jd - 2451545.0) / 36525;
}

/**
 * Calculate Sun's mean longitude
 */
function getSunMeanLongitude(T: number): number {
  return normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
}

/**
 * Calculate Sun's mean anomaly
 */
function getSunMeanAnomaly(T: number): number {
  return normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
}

/**
 * Calculate Earth's eccentricity
 */
function getEarthEccentricity(T: number): number {
  return 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
}

/**
 * Calculate Sun's equation of center
 */
function getSunEquationOfCenter(T: number, M: number): number {
  return (
    (1.9146 - 0.004817 * T - 0.000014 * T * T) * sin(M) +
    (0.019993 - 0.000101 * T) * sin(2 * M) +
    0.00029 * sin(3 * M)
  );
}

/**
 * Calculate Sun's true longitude
 */
function getSunTrueLongitude(T: number): number {
  const L0 = getSunMeanLongitude(T);
  const M = getSunMeanAnomaly(T);
  const C = getSunEquationOfCenter(T, M);
  return normalizeAngle(L0 + C);
}

/**
 * Calculate Sun's apparent longitude
 */
function getSunApparentLongitude(T: number): number {
  const sunTrueLong = getSunTrueLongitude(T);
  const omega = 125.04 - 1934.136 * T;
  return sunTrueLong - 0.00569 - 0.00478 * sin(omega);
}

/**
 * Calculate mean obliquity of the ecliptic
 */
function getMeanObliquityOfEcliptic(T: number): number {
  return (
    23.439291 - 0.013004167 * T - 0.00000016389 * T * T + 0.0000005036 * T * T * T
  );
}

/**
 * Calculate corrected obliquity
 */
function getObliquityCorrection(T: number): number {
  const e0 = getMeanObliquityOfEcliptic(T);
  const omega = 125.04 - 1934.136 * T;
  return e0 + 0.00256 * cos(omega);
}

/**
 * Calculate Sun's declination
 */
function getSunDeclination(T: number): number {
  const e = getObliquityCorrection(T);
  const lambda = getSunApparentLongitude(T);
  return asin(sin(e) * sin(lambda));
}

/**
 * Calculate equation of time (in minutes)
 */
function getEquationOfTime(T: number): number {
  const epsilon = getObliquityCorrection(T);
  const L0 = getSunMeanLongitude(T);
  const e = getEarthEccentricity(T);
  const M = getSunMeanAnomaly(T);

  const y = tan(epsilon / 2) * tan(epsilon / 2);

  const eqTime =
    y * sin(2 * L0) -
    2 * e * sin(M) +
    4 * e * y * sin(M) * cos(2 * L0) -
    0.5 * y * y * sin(4 * L0) -
    1.25 * e * e * sin(2 * M);

  return 4 * eqTime * DEG; // Convert to minutes
}

/**
 * Calculate hour angle for sunrise/sunset
 * @param latitude - Observer's latitude
 * @param declination - Sun's declination
 * @param altitude - Target altitude (negative for below horizon)
 * @returns Hour angle in degrees, or NaN if sun doesn't reach altitude
 */
function getHourAngle(
  latitude: number,
  declination: number,
  altitude: number
): number {
  const cosH =
    (cos(90 - altitude) - sin(latitude) * sin(declination)) /
    (cos(latitude) * cos(declination));

  if (cosH > 1) return NaN; // Sun never rises
  if (cosH < -1) return NaN; // Sun never sets

  return acos(cosH);
}

// =============================================================================
// MAIN FUNCTIONS
// =============================================================================

/**
 * Validate location
 */
function validateLocation(location: Location): void {
  if (location.latitude < -90 || location.latitude > 90) {
    throw new LunarCalendarError(
      'Latitude must be between -90 and 90',
      ErrorCode.INVALID_LOCATION
    );
  }
  if (location.longitude < -180 || location.longitude > 180) {
    throw new LunarCalendarError(
      'Longitude must be between -180 and 180',
      ErrorCode.INVALID_LOCATION
    );
  }
}

/**
 * Format time from decimal hours to HH:MM string
 */
function formatTime(decimalHours: number): string {
  if (isNaN(decimalHours)) return '--:--';

  // Normalize to 0-24 range
  decimalHours = ((decimalHours % 24) + 24) % 24;

  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);

  // Handle minute overflow
  if (minutes === 60) {
    return `${String((hours + 1) % 24).padStart(2, '0')}:00`;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Calculate sun times for a specific date and location
 *
 * @param date - Solar date
 * @param location - Geographic location
 * @returns Sun times object
 *
 * @example
 * ```typescript
 * const times = getSunTimes(
 *   { year: 2024, month: 6, day: 21 },
 *   VIETNAM_LOCATIONS.hanoi
 * );
 * console.log(times.sunrise, times.sunset);
 * // "05:15" "18:45"
 * ```
 */
export function getSunTimes(date: SolarDate, location: Location): SunTimes {
  validateLocation(location);

  const { latitude, longitude, timezone = 7 } = location;

  // Get Julian Day at noon
  const jd = toJulianDay(date) + 0.5;
  const T = getJulianCentury(jd);

  // Calculate sun parameters
  const declination = getSunDeclination(T);
  const eqTime = getEquationOfTime(T);

  // Solar noon (in minutes from midnight, local time)
  const solarNoonMinutes = 720 - 4 * longitude - eqTime + timezone * 60;
  const solarNoon = solarNoonMinutes / 60;

  // Hour angle for sunrise/sunset
  const hourAngle = getHourAngle(latitude, declination, SUNRISE_SUNSET_ALTITUDE);
  const hourAngleCivil = getHourAngle(latitude, declination, CIVIL_TWILIGHT_ALTITUDE);

  // Calculate times
  const sunrise = solarNoon - hourAngle / 15;
  const sunset = solarNoon + hourAngle / 15;
  const civilDawn = solarNoon - hourAngleCivil / 15;
  const civilDusk = solarNoon + hourAngleCivil / 15;

  return {
    sunrise: formatTime(sunrise),
    sunset: formatTime(sunset),
    solarNoon: formatTime(solarNoon),
    civilDawn: formatTime(civilDawn),
    civilDusk: formatTime(civilDusk),
  };
}

/**
 * Get sun times for Hanoi (default location)
 *
 * @param date - Solar date
 * @returns Sun times object
 */
export function getSunTimesHanoi(date: SolarDate): SunTimes {
  return getSunTimes(date, VIETNAM_LOCATIONS.hanoi);
}

/**
 * Get day length in hours
 *
 * @param date - Solar date
 * @param location - Geographic location
 * @returns Day length in decimal hours
 */
export function getDayLength(date: SolarDate, location: Location): number {
  const times = getSunTimes(date, location);

  if (times.sunrise === '--:--' || times.sunset === '--:--') {
    return NaN;
  }

  const [sunriseH, sunriseM] = times.sunrise.split(':').map(Number);
  const [sunsetH, sunsetM] = times.sunset.split(':').map(Number);

  const sunrise = sunriseH + sunriseM / 60;
  const sunset = sunsetH + sunsetM / 60;

  return sunset - sunrise;
}

/**
 * Check if sun is up at a specific time
 *
 * @param date - Solar date
 * @param hour - Hour (0-23)
 * @param minute - Minute (0-59)
 * @param location - Geographic location
 * @returns boolean
 */
export function isSunUp(
  date: SolarDate,
  hour: number,
  minute: number,
  location: Location
): boolean {
  const times = getSunTimes(date, location);

  if (times.sunrise === '--:--' || times.sunset === '--:--') {
    return false;
  }

  const currentTime = hour + minute / 60;

  const [sunriseH, sunriseM] = times.sunrise.split(':').map(Number);
  const [sunsetH, sunsetM] = times.sunset.split(':').map(Number);

  const sunrise = sunriseH + sunriseM / 60;
  const sunset = sunsetH + sunsetM / 60;

  return currentTime >= sunrise && currentTime <= sunset;
}
