# 🌙 Lịch Âm Việt Nam

Ứng dụng lịch âm dương Việt Nam - Cross-platform (Web + Android + iOS) với React Native Expo.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-61DAFB.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51-000020.svg)](https://expo.dev/)

## ✨ Features

### Core Features (MVP)
- 📅 **Lịch Âm Dương** - Hiển thị lịch với ngày âm/dương (1900-2100)
- 🐲 **Can Chi** - Can Chi năm/tháng/ngày/giờ đầy đủ
- ⭐ **Hoàng Đạo - Hắc Đạo** - 6 giờ tốt, 6 giờ xấu mỗi ngày
- 🌸 **24 Tiết Khí** - Tiết khí trong năm
- 🌅 **Sunrise/Sunset** - Giờ mặt trời theo vị trí

### Technical Highlights
- 📴 **100% Offline** - Tất cả tính toán client-side
- 🚀 **Siêu nhanh** - Pre-computed lookup tables
- 📱 **Cross-platform** - Web, Android, iOS từ một codebase
- 🧱 **Monorepo** - Core logic tách biệt, reusable

## 📁 Project Structure

```
lunar-calendar/
├── apps/
│   └── mobile/              # React Native Expo app
│       ├── app/             # Expo Router pages
│       └── components/      # UI components
│
├── packages/
│   └── core/                # Pure TypeScript business logic
│       ├── src/
│       │   ├── lunar/       # Lunar calendar calculations
│       │   ├── canchi/      # Can Chi calculations
│       │   ├── hoangdao/    # Hoang dao/hac dao
│       │   ├── solar-terms/ # 24 tiết khí
│       │   ├── suncalc/     # Sunrise/sunset
│       │   └── data/        # Pre-computed data
│       └── tests/
│
├── docs/                    # Documentation
│   ├── 01-PRD.md
│   ├── 02-Technical-Spec.md
│   └── 03-Development-Guide.md
│
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Android Studio (for Android)
- Xcode 15+ (for iOS, macOS only)

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/lunar-calendar.git
cd lunar-calendar

# Install dependencies
pnpm install

# Build core package
pnpm build:core
```

### Development

```bash
# Start Web development
pnpm dev:web

# Start Android development
pnpm dev:android

# Start iOS development (macOS only)
pnpm dev:ios
```

### Build

```bash
# Build for Web
pnpm build:web

# Build Android APK (Preview)
pnpm build:android

# Build Android AAB (Production)
pnpm build:android:release
```

## 📦 Using Core Package

```typescript
import {
  solarToLunar,
  lunarToSolar,
  getDayInfo,
  getYearCanChi,
  getSunTimes,
  VIETNAM_LOCATIONS,
} from '@lunar-calendar/core';

// Convert solar to lunar
const lunar = solarToLunar({ year: 2024, month: 2, day: 10 });
console.log(lunar);
// { year: 2024, month: 1, day: 1, isLeapMonth: false, monthName: 'Giêng' }

// Get full day information
const dayInfo = getDayInfo({ year: 2024, month: 2, day: 10 });
console.log(dayInfo.canChiYear.fullName); // "Giáp Thìn"
console.log(dayInfo.isHoangDaoDay);       // true/false
console.log(dayInfo.hours);               // 12 hours with hoang/hac dao info

// Get sunrise/sunset for Hanoi
const sun = getSunTimes({ year: 2024, month: 6, day: 21 }, VIETNAM_LOCATIONS.hanoi);
console.log(sun.sunrise); // "05:15"
console.log(sun.sunset);  // "18:45"
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [PRD](docs/01-PRD.md) | Product Requirements Document |
| [Technical Spec](docs/02-Technical-Spec.md) | Technical Specification |
| [Dev Guide](docs/03-Development-Guide.md) | Development Guide |

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test:watch
```

## 📊 Data Sources

- **Lunar Calendar**: Vietnam Academy of Science and Technology
- **Solar Terms**: Astronomical algorithms (Jean Meeus)
- **Sunrise/Sunset**: SunCalc algorithm

## 🗓️ Supported Range

- **Years**: 1900 - 2100 (200 years)
- **Accuracy**: 100% match with Vietnam Academy data

## 📱 Screenshots

| Home | Day Detail |
|------|------------|
| Calendar grid with lunar dates | Full Can Chi, hours info |

## 🤝 Contributing

See [Development Guide](docs/03-Development-Guide.md) for contribution guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Made with ❤️ for Vietnamese people
