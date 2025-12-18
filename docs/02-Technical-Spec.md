# Technical Specification Document
# Lịch Âm Dương Việt Nam

**Version:** 1.0  
**Date:** December 2024  
**Status:** Draft

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Web App   │  │ Android App │  │  iOS App    │         │
│  │ (React DOM) │  │(React Native)│  │  (Future)   │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                  │
│         └────────────────┼────────────────┘                  │
│                          │                                   │
│  ┌───────────────────────▼───────────────────────┐          │
│  │           Shared UI Components                 │          │
│  │        (React Native + Expo)                   │          │
│  └───────────────────────┬───────────────────────┘          │
└──────────────────────────┼───────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                    Business Logic Layer                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              @lunar-calendar/core                     │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │    │
│  │  │  Lunar   │ │  CanChi  │ │  Solar   │ │ HoangDao│ │    │
│  │  │Calculator│ │ Calculator│ │  Terms   │ │ Service │ │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └─────────┘ │    │
│  │  ┌──────────┐ ┌──────────┐                          │    │
│  │  │ SunCalc  │ │  Utils   │                          │    │
│  │  │ Service  │ │          │                          │    │
│  │  └──────────┘ └──────────┘                          │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                      Data Layer                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            Pre-computed Lookup Tables                │    │
│  │  ┌──────────────┐  ┌──────────────┐                 │    │
│  │  │ lunar-data.ts │  │solar-terms.ts│                 │    │
│  │  │ (1900-2100)   │  │ (1900-2100)  │                 │    │
│  │  └──────────────┘  └──────────────┘                 │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 Monorepo Structure

```
lunar-calendar/
├── apps/
│   └── mobile/                 # React Native Expo app
│       ├── app/               # Expo Router pages
│       ├── components/        # App-specific components
│       ├── hooks/             # Custom hooks
│       ├── app.json           # Expo config
│       └── package.json
│
├── packages/
│   ├── core/                  # Business logic (pure TypeScript)
│   │   ├── src/
│   │   │   ├── lunar/        # Lunar calendar calculations
│   │   │   ├── canchi/       # Can Chi calculations
│   │   │   ├── hoangdao/     # Hoang dao calculations
│   │   │   ├── solar-terms/  # 24 solar terms
│   │   │   ├── suncalc/      # Sunrise/sunset
│   │   │   ├── data/         # Pre-computed data
│   │   │   └── index.ts
│   │   ├── tests/
│   │   └── package.json
│   │
│   └── ui/                    # Shared UI components
│       ├── src/
│       │   ├── CalendarGrid/
│       │   ├── DayCell/
│       │   ├── DayDetail/
│       │   └── index.ts
│       └── package.json
│
├── package.json               # Root workspace config
├── turbo.json                 # Turborepo config
└── tsconfig.base.json        # Shared TS config
```

---

## 2. Core Package Architecture

### 2.1 Module Dependency Graph

```
                    ┌─────────────┐
                    │    index    │
                    │  (exports)  │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │  lunar   │     │  canchi  │     │ hoangdao │
   │calculator│◄────┤calculator│◄────┤ service  │
   └────┬─────┘     └────┬─────┘     └──────────┘
        │                │
        │                │
        ▼                ▼
   ┌──────────┐     ┌──────────┐
   │lunar-data│     │solar-terms│
   │ (static) │     │ (static)  │
   └──────────┘     └──────────┘
```

### 2.2 Core Interfaces

```typescript
// types.ts

/**
 * Ngày dương lịch (Solar/Gregorian)
 */
interface SolarDate {
  year: number;    // 1900-2100
  month: number;   // 1-12
  day: number;     // 1-31
}

/**
 * Ngày âm lịch (Lunar)
 */
interface LunarDate {
  year: number;    // 1900-2100
  month: number;   // 1-12 (13 nếu tháng nhuận)
  day: number;     // 1-30
  isLeapMonth: boolean;
  monthName: string;  // "Giêng", "Hai"...
}

/**
 * Can Chi (Stem-Branch)
 */
interface CanChi {
  can: number;     // 0-9 (Giáp=0, Ất=1...)
  chi: number;     // 0-11 (Tý=0, Sửu=1...)
  canName: string;
  chiName: string;
  fullName: string; // "Giáp Tý"
  element: Element; // Ngũ hành
}

/**
 * Ngũ Hành (Five Elements)
 */
type Element = 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho';

/**
 * Giờ trong ngày (12 canh)
 */
interface HourInfo {
  chi: number;          // 0-11
  chiName: string;      // "Tý", "Sửu"...
  startHour: number;    // 23, 1, 3...
  endHour: number;      // 1, 3, 5...
  type: 'hoangdao' | 'hacdao';
  hoangDaoName?: string; // "Thanh Long", "Minh Đường"...
}

/**
 * Thông tin đầy đủ một ngày
 */
interface DayInfo {
  solar: SolarDate;
  lunar: LunarDate;
  canChiYear: CanChi;
  canChiMonth: CanChi;
  canChiDay: CanChi;
  solarTerm?: SolarTerm;
  hours: HourInfo[];
  isHoangDao: boolean;
  sunrise?: string;  // "06:15"
  sunset?: string;   // "17:45"
}

/**
 * Tiết khí (Solar Term)
 */
interface SolarTerm {
  index: number;     // 0-23
  name: string;      // "Lập Xuân", "Vũ Thủy"...
  date: SolarDate;
}
```

---

## 3. Algorithm Specifications

### 3.1 Lunar Calendar Calculation

#### Data Source
Pre-computed lunar data từ Vietnam Academy of Science & Technology, lưu dạng lookup table:

```typescript
// lunar-data.ts
// Mỗi năm: 13 bytes encode thông tin 12-13 tháng âm
// Bit structure:
// - Bits 0-11: Số ngày mỗi tháng (0=29 ngày, 1=30 ngày)
// - Bits 12-15: Tháng nhuận (0=không có, 1-12=tháng nhuận)
// - Bits 16-23: Ngày bắt đầu năm âm (offset from Jan 1)

export const LUNAR_DATA: Record<number, number> = {
  1900: 0x04bd8,  // Năm 1900
  1901: 0x04ae0,
  // ... 200 năm
  2100: 0x0d4a0,
};

// Ngày Julian của ngày 1/1/1900
export const JULIAN_1900 = 2415021;
```

#### Core Algorithm

```typescript
/**
 * Chuyển đổi dương lịch → âm lịch
 * Time Complexity: O(1) với lookup table
 */
function solarToLunar(solar: SolarDate): LunarDate {
  // 1. Tính Julian Day Number
  const jd = toJulianDay(solar);
  
  // 2. Tính offset từ 1/1/1900
  const dayOffset = jd - JULIAN_1900;
  
  // 3. Binary search tìm năm âm
  const lunarYear = findLunarYear(dayOffset);
  
  // 4. Tính tháng và ngày trong năm
  const { month, day, isLeap } = findMonthDay(lunarYear, dayOffset);
  
  return {
    year: lunarYear,
    month,
    day,
    isLeapMonth: isLeap,
    monthName: MONTH_NAMES[month - 1]
  };
}

/**
 * Chuyển đổi âm lịch → dương lịch
 */
function lunarToSolar(lunar: LunarDate): SolarDate {
  // 1. Tính số ngày từ 1/1/1900 âm lịch
  const dayOffset = calculateLunarOffset(lunar);
  
  // 2. Tính Julian Day
  const jd = JULIAN_1900 + dayOffset;
  
  // 3. Convert về dương lịch
  return fromJulianDay(jd);
}
```

### 3.2 Can Chi Calculation

#### Thiên Can (10 Stems)
```typescript
const THIEN_CAN = [
  { name: 'Giáp', element: 'moc', yin: false },
  { name: 'Ất',   element: 'moc', yin: true },
  { name: 'Bính', element: 'hoa', yin: false },
  { name: 'Đinh', element: 'hoa', yin: true },
  { name: 'Mậu',  element: 'tho', yin: false },
  { name: 'Kỷ',   element: 'tho', yin: true },
  { name: 'Canh', element: 'kim', yin: false },
  { name: 'Tân',  element: 'kim', yin: true },
  { name: 'Nhâm', element: 'thuy', yin: false },
  { name: 'Quý',  element: 'thuy', yin: true },
];
```

#### Địa Chi (12 Branches)
```typescript
const DIA_CHI = [
  { name: 'Tý',   animal: 'Chuột', element: 'thuy' },
  { name: 'Sửu',  animal: 'Trâu',  element: 'tho' },
  { name: 'Dần',  animal: 'Hổ',    element: 'moc' },
  { name: 'Mão',  animal: 'Mèo',   element: 'moc' },
  { name: 'Thìn', animal: 'Rồng',  element: 'tho' },
  { name: 'Tỵ',   animal: 'Rắn',   element: 'hoa' },
  { name: 'Ngọ',  animal: 'Ngựa',  element: 'hoa' },
  { name: 'Mùi',  animal: 'Dê',    element: 'tho' },
  { name: 'Thân', animal: 'Khỉ',   element: 'kim' },
  { name: 'Dậu',  animal: 'Gà',    element: 'kim' },
  { name: 'Tuất', animal: 'Chó',   element: 'tho' },
  { name: 'Hợi',  animal: 'Lợn',   element: 'thuy' },
];
```

#### Calculation Formulas

```typescript
/**
 * Can Chi năm
 * Công thức: (năm âm - 4) mod 60
 * Ví dụ: 2024 → (2024-4) mod 60 = 40 → Giáp Thìn
 */
function getYearCanChi(lunarYear: number): CanChi {
  const offset = (lunarYear - 4) % 60;
  const can = offset % 10;
  const chi = offset % 12;
  return buildCanChi(can, chi);
}

/**
 * Can Chi tháng
 * Công thức dựa trên Can năm và tháng âm
 * Can tháng = (Can năm * 2 + tháng) mod 10
 * Chi tháng = (tháng + 2) mod 12 (Tháng Giêng = Dần)
 */
function getMonthCanChi(lunarYear: number, lunarMonth: number): CanChi {
  const yearCan = (lunarYear - 4) % 10;
  const can = (yearCan * 2 + lunarMonth) % 10;
  const chi = (lunarMonth + 1) % 12; // Tháng 1 = Dần (index 2)
  return buildCanChi(can, chi);
}

/**
 * Can Chi ngày
 * Dựa trên Julian Day Number
 * Can = (JD + 9) mod 10
 * Chi = (JD + 1) mod 12
 */
function getDayCanChi(solarDate: SolarDate): CanChi {
  const jd = toJulianDay(solarDate);
  const can = (jd + 9) % 10;
  const chi = (jd + 1) % 12;
  return buildCanChi(can, chi);
}

/**
 * Can Chi giờ
 * Chi giờ cố định theo 12 canh
 * Can giờ phụ thuộc Can ngày
 */
function getHourCanChi(dayCan: number, hourChi: number): CanChi {
  // Can giờ Tý = (Can ngày * 2) mod 10
  const hourCan = (dayCan * 2 + hourChi) % 10;
  return buildCanChi(hourCan, hourChi);
}
```

### 3.3 Hoàng Đạo Calculation

#### 12 Trực (Day Stars)
```typescript
const TRUC = [
  'Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp',
  'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế'
];

// Hoàng đạo days (good): Trừ, Định, Chấp, Thành, Khai
// Hắc đạo days (bad): Kiến, Mãn, Bình, Phá, Nguy, Thu, Bế
```

#### 12 Sao Hoàng Đạo (Hour Stars)
```typescript
const HOANG_DAO_STARS = [
  { name: 'Thanh Long', type: 'hoangdao' },
  { name: 'Minh Đường', type: 'hoangdao' },
  { name: 'Thiên Hình', type: 'hacdao' },
  { name: 'Chu Tước',   type: 'hacdao' },
  { name: 'Kim Quỹ',    type: 'hoangdao' },
  { name: 'Thiên Đức',  type: 'hoangdao' },
  { name: 'Bạch Hổ',    type: 'hacdao' },
  { name: 'Ngọc Đường', type: 'hoangdao' },
  { name: 'Thiên Lao',  type: 'hacdao' },
  { name: 'Huyền Vũ',   type: 'hacdao' },
  { name: 'Tư Mệnh',    type: 'hoangdao' },
  { name: 'Câu Trần',   type: 'hacdao' },
];
```

#### Algorithm

```typescript
/**
 * Tính giờ hoàng đạo trong ngày
 * Dựa trên Chi ngày để xác định sao khởi đầu
 */
function getHoangDaoHours(dayChi: number): HourInfo[] {
  // Bảng tra sao khởi đầu giờ Tý theo Chi ngày
  const START_STAR_TABLE = [0, 2, 4, 6, 8, 10, 0, 2, 4, 6, 8, 10];
  const startStar = START_STAR_TABLE[dayChi];
  
  const hours: HourInfo[] = [];
  for (let hourChi = 0; hourChi < 12; hourChi++) {
    const starIndex = (startStar + hourChi) % 12;
    const star = HOANG_DAO_STARS[starIndex];
    hours.push({
      chi: hourChi,
      chiName: DIA_CHI[hourChi].name,
      startHour: getHourStart(hourChi),
      endHour: getHourEnd(hourChi),
      type: star.type,
      hoangDaoName: star.name,
    });
  }
  return hours;
}
```

### 3.4 Solar Terms (Tiết Khí)

```typescript
const SOLAR_TERMS = [
  { name: 'Tiểu Hàn',   month: 1 },
  { name: 'Đại Hàn',    month: 1 },
  { name: 'Lập Xuân',   month: 2 },
  { name: 'Vũ Thủy',    month: 2 },
  { name: 'Kinh Trập',  month: 3 },
  { name: 'Xuân Phân',  month: 3 },
  { name: 'Thanh Minh', month: 4 },
  { name: 'Cốc Vũ',     month: 4 },
  { name: 'Lập Hạ',     month: 5 },
  { name: 'Tiểu Mãn',   month: 5 },
  { name: 'Mang Chủng', month: 6 },
  { name: 'Hạ Chí',     month: 6 },
  { name: 'Tiểu Thử',   month: 7 },
  { name: 'Đại Thử',    month: 7 },
  { name: 'Lập Thu',    month: 8 },
  { name: 'Xử Thử',     month: 8 },
  { name: 'Bạch Lộ',    month: 9 },
  { name: 'Thu Phân',   month: 9 },
  { name: 'Hàn Lộ',     month: 10 },
  { name: 'Sương Giáng',month: 10 },
  { name: 'Lập Đông',   month: 11 },
  { name: 'Tiểu Tuyết', month: 11 },
  { name: 'Đại Tuyết',  month: 12 },
  { name: 'Đông Chí',   month: 12 },
];

// Pre-computed dates stored in lookup table
// Calculated using astronomical algorithms
```

### 3.5 Sunrise/Sunset (SunCalc)

```typescript
/**
 * Tính sunrise/sunset theo tọa độ
 * Algorithm: Jean Meeus - Astronomical Algorithms
 */
function getSunTimes(
  date: SolarDate,
  latitude: number,
  longitude: number,
  timezone: number = 7 // Vietnam UTC+7
): { sunrise: string; sunset: string; } {
  const jd = toJulianDay(date);
  
  // Julian Century
  const T = (jd - 2451545.0) / 36525;
  
  // Solar coordinates
  const L0 = 280.46646 + 36000.76983 * T; // Mean longitude
  const M = 357.52911 + 35999.05029 * T;  // Mean anomaly
  
  // Equation of center
  const C = (1.914602 - 0.004817 * T) * sin(M)
          + 0.019993 * sin(2 * M);
  
  // Sun's true longitude & declination
  const sunLong = L0 + C;
  const declination = asin(sin(23.439) * sin(sunLong));
  
  // Hour angle
  const cosH = (sin(-0.833) - sin(latitude) * sin(declination))
             / (cos(latitude) * cos(declination));
  
  // Solar noon
  const solarNoon = 12 - longitude / 15 + timezone;
  
  // Sunrise/Sunset
  const H = acos(cosH) * 180 / PI / 15;
  const sunrise = solarNoon - H;
  const sunset = solarNoon + H;
  
  return {
    sunrise: formatTime(sunrise),
    sunset: formatTime(sunset),
  };
}
```

---

## 4. Data Storage Strategy

### 4.1 Static Data (Bundled)

| Data | Size | Format | Update Frequency |
|------|------|--------|------------------|
| Lunar Data 1900-2100 | ~4KB | TypeScript const | Never |
| Solar Terms | ~2KB | TypeScript const | Never |
| Can Chi Names | <1KB | TypeScript const | Never |
| Vietnamese Holidays | ~1KB | TypeScript const | Yearly |

### 4.2 User Data (AsyncStorage/MMKV)

```typescript
interface UserPreferences {
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
}

interface Bookmark {
  id: string;
  date: SolarDate;
  note: string;
  createdAt: number;
}
```

---

## 5. Performance Optimization

### 5.1 Memoization Strategy

```typescript
// Cache kết quả tính toán theo ngày
const dayInfoCache = new Map<string, DayInfo>();

function getDayInfo(date: SolarDate): DayInfo {
  const key = `${date.year}-${date.month}-${date.day}`;
  
  if (dayInfoCache.has(key)) {
    return dayInfoCache.get(key)!;
  }
  
  const info = calculateDayInfo(date);
  dayInfoCache.set(key, info);
  
  // Giới hạn cache size
  if (dayInfoCache.size > 365) {
    const firstKey = dayInfoCache.keys().next().value;
    dayInfoCache.delete(firstKey);
  }
  
  return info;
}
```

### 5.2 Lazy Loading

```typescript
// Lazy load solar terms data
const getSolarTermsData = async (year: number) => {
  return import(`./data/solar-terms-${year}.json`);
};
```

### 5.3 Bundle Optimization

| Technique | Expected Savings |
|-----------|-----------------|
| Tree shaking | ~30% |
| Code splitting | Load time -50% |
| Minification | ~60% |
| Gzip | ~70% |

---

## 6. Testing Strategy

### 6.1 Unit Tests

```typescript
// lunar.test.ts
describe('Lunar Calendar', () => {
  test('converts 2024-02-10 to lunar correctly', () => {
    const lunar = solarToLunar({ year: 2024, month: 2, day: 10 });
    expect(lunar).toEqual({
      year: 2024,
      month: 1,
      day: 1,
      isLeapMonth: false,
      monthName: 'Giêng'
    });
  });
  
  test('handles leap month in 2023', () => {
    const lunar = solarToLunar({ year: 2023, month: 4, day: 20 });
    expect(lunar.isLeapMonth).toBe(true);
  });
});
```

### 6.2 Test Data Sources
- Vietnam Academy calendar data
- Hong Kong Observatory lunar data
- Cross-reference with "Lịch Vạn Niên" books

---

## 7. Error Handling

```typescript
class LunarCalendarError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public details?: unknown
  ) {
    super(message);
    this.name = 'LunarCalendarError';
  }
}

enum ErrorCode {
  INVALID_DATE = 'INVALID_DATE',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  INVALID_LUNAR_DATE = 'INVALID_LUNAR_DATE',
}

// Validate date range
function validateYear(year: number): void {
  if (year < 1900 || year > 2100) {
    throw new LunarCalendarError(
      `Year ${year} is out of supported range (1900-2100)`,
      ErrorCode.OUT_OF_RANGE
    );
  }
}
```

---

## 8. API Reference

### 8.1 Core Functions

```typescript
// Lunar conversion
solarToLunar(solar: SolarDate): LunarDate
lunarToSolar(lunar: LunarDate): SolarDate

// Can Chi
getYearCanChi(lunarYear: number): CanChi
getMonthCanChi(lunarYear: number, lunarMonth: number): CanChi
getDayCanChi(solar: SolarDate): CanChi
getHourCanChi(dayCan: number, hourChi: number): CanChi

// Hoang Dao
getHoangDaoHours(dayChi: number): HourInfo[]
isHoangDaoDay(solar: SolarDate): boolean

// Solar Terms
getSolarTerm(solar: SolarDate): SolarTerm | null
getSolarTermsInYear(year: number): SolarTerm[]

// Sun times
getSunTimes(solar: SolarDate, lat: number, lng: number): SunTimes

// Combined
getDayInfo(solar: SolarDate, location?: Location): DayInfo
getMonthCalendar(year: number, month: number): DayInfo[]
```
