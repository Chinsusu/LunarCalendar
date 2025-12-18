# Development Guide
# Lịch Âm Dương Việt Nam

---

## 1. Development Environment Setup

### 1.1 Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ LTS | Runtime |
| pnpm | 8+ | Package manager |
| Git | 2.30+ | Version control |
| VS Code | Latest | IDE (recommended) |
| Android Studio | Latest | Android development |
| Xcode | 15+ | iOS development (macOS only) |

### 1.2 Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/your-org/lunar-calendar.git
cd lunar-calendar

# 2. Install pnpm (if not installed)
npm install -g pnpm

# 3. Install dependencies
pnpm install

# 4. Build core package
pnpm build:core

# 5. Verify installation
pnpm test
```

### 1.3 VS Code Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "orta.vscode-jest",
    "msjsdiag.vscode-react-native"
  ]
}
```

---

## 2. Project Commands

### 2.1 Development Commands

```bash
# Start web development
pnpm dev:web

# Start Android development  
pnpm dev:android

# Start iOS development (macOS only)
pnpm dev:ios

# Run all in parallel
pnpm dev
```

### 2.2 Build Commands

```bash
# Build core package
pnpm build:core

# Build web for production
pnpm build:web

# Build Android APK
pnpm build:android

# Build Android AAB (Play Store)
pnpm build:android:release

# Build all packages
pnpm build
```

### 2.3 Testing Commands

```bash
# Run all tests
pnpm test

# Run core package tests
pnpm test:core

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

### 2.4 Utility Commands

```bash
# Lint all files
pnpm lint

# Fix lint errors
pnpm lint:fix

# Format code
pnpm format

# Type check
pnpm typecheck

# Clean build artifacts
pnpm clean
```

---

## 3. Development Workflow

### 3.1 Branch Strategy

```
main (production)
  │
  ├── develop (integration)
  │     │
  │     ├── feature/calendar-view
  │     ├── feature/canchi-calculation
  │     ├── bugfix/lunar-conversion
  │     └── hotfix/crash-on-load
  │
  └── release/v1.0.0
```

### 3.2 Commit Convention

```
<type>(<scope>): <subject>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructure
- test: Adding tests
- chore: Maintenance

Examples:
feat(core): add lunar to solar conversion
fix(ui): calendar grid alignment on Android
docs(readme): update installation guide
```

### 3.3 Pull Request Process

1. Create feature branch from `develop`
2. Implement changes with tests
3. Run `pnpm check` (lint + type + test)
4. Create PR with description
5. Wait for CI/CD and code review
6. Squash merge to `develop`

---

## 4. Architecture Guidelines

### 4.1 Core Package Rules

```typescript
// ✅ DO: Pure functions, no side effects
export function solarToLunar(date: SolarDate): LunarDate {
  return calculateLunar(date);
}

// ❌ DON'T: Side effects in core
export function solarToLunar(date: SolarDate): LunarDate {
  console.log('Converting...'); // No logging
  analytics.track('convert'); // No external calls
  return calculateLunar(date);
}

// ✅ DO: Explicit dependencies
export function getDayInfo(
  date: SolarDate,
  options?: { location?: Location }
): DayInfo {
  // ...
}

// ❌ DON'T: Implicit global state
let globalLocation: Location;
export function getDayInfo(date: SolarDate): DayInfo {
  // Uses globalLocation - bad!
}
```

### 4.2 UI Component Rules

```typescript
// ✅ DO: Small, focused components
export function DayCell({ date, isToday, onPress }: DayCellProps) {
  return (
    <Pressable onPress={onPress}>
      <Text>{date.day}</Text>
      {isToday && <TodayIndicator />}
    </Pressable>
  );
}

// ❌ DON'T: Monolithic components
export function Calendar() {
  // 500 lines of code handling everything
}

// ✅ DO: Separate logic from UI
function useCalendarData(year: number, month: number) {
  return useMemo(() => getMonthCalendar(year, month), [year, month]);
}

export function CalendarGrid({ year, month }: Props) {
  const days = useCalendarData(year, month);
  return <Grid data={days} renderItem={DayCell} />;
}
```

### 4.3 File Naming

```
Components/       PascalCase      CalendarGrid.tsx
Hooks/            camelCase       useCalendar.ts
Utils/            camelCase       dateUtils.ts
Types/            PascalCase      DayInfo.ts
Constants/        UPPER_SNAKE     LUNAR_DATA.ts
Tests/            *.test.ts       lunar.test.ts
```

---

## 5. Testing Guidelines

### 5.1 Test Structure

```typescript
// lunar.test.ts
describe('LunarCalculator', () => {
  describe('solarToLunar', () => {
    it('converts regular date correctly', () => {
      const result = solarToLunar({ year: 2024, month: 2, day: 10 });
      expect(result.month).toBe(1);
      expect(result.day).toBe(1);
    });

    it('handles leap month', () => {
      // ...
    });

    it('throws for out-of-range date', () => {
      expect(() => solarToLunar({ year: 1800, month: 1, day: 1 }))
        .toThrow(LunarCalendarError);
    });
  });
});
```

### 5.2 Test Coverage Requirements

| Package | Statements | Branches | Functions |
|---------|------------|----------|-----------|
| core | 95% | 90% | 95% |
| ui | 80% | 75% | 80% |
| app | 70% | 65% | 70% |

### 5.3 Testing Edge Cases

```typescript
// Lunar calendar edge cases to test
const EDGE_CASES = [
  // Leap months
  { solar: { year: 2023, month: 4, day: 20 }, expectLeap: true },
  
  // Year boundaries
  { solar: { year: 2024, month: 1, day: 1 }, lunarYear: 2023 },
  
  // 29 vs 30 day months
  { lunar: { year: 2024, month: 1, day: 30 }, valid: true },
  { lunar: { year: 2024, month: 2, day: 30 }, valid: false },
  
  // Range boundaries
  { solar: { year: 1900, month: 1, day: 31 }, valid: true },
  { solar: { year: 2100, month: 12, day: 31 }, valid: true },
];
```

---

## 6. Debugging

### 6.1 React Native Debugger

```bash
# Install Flipper
brew install --cask flipper

# Or use React Native Debugger
brew install --cask react-native-debugger
```

### 6.2 Console Logging

```typescript
// Development-only logging
if (__DEV__) {
  console.log('Debug info:', data);
}

// Use structured logging
import { logger } from '@/utils/logger';

logger.debug('Calendar', { year, month, action: 'load' });
logger.error('Calculation failed', { error, input });
```

### 6.3 Performance Profiling

```typescript
// Measure calculation time
const start = performance.now();
const result = heavyCalculation();
const duration = performance.now() - start;

if (duration > 16) { // > 1 frame
  console.warn(`Slow calculation: ${duration}ms`);
}
```

---

## 7. Release Process

### 7.1 Version Bump

```bash
# Patch release (1.0.0 -> 1.0.1)
pnpm version:patch

# Minor release (1.0.0 -> 1.1.0)
pnpm version:minor

# Major release (1.0.0 -> 2.0.0)
pnpm version:major
```

### 7.2 Web Deployment

```bash
# Build and deploy to Vercel
pnpm deploy:web

# Or manual
pnpm build:web
vercel deploy ./apps/mobile/dist
```

### 7.3 Android Release

```bash
# 1. Update version in app.json
# 2. Build release AAB
pnpm build:android:release

# 3. Upload to Play Console
# (Manual step via Google Play Console)
```

### 7.4 Release Checklist

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Build successful on all platforms
- [ ] QA sign-off
- [ ] Release notes prepared

---

## 8. Troubleshooting

### 8.1 Common Issues

| Issue | Solution |
|-------|----------|
| Metro bundler stuck | `pnpm clean && pnpm install` |
| Android build fails | Check JDK version, run `cd android && ./gradlew clean` |
| iOS pod install fails | `cd ios && pod deintegrate && pod install` |
| TypeScript errors after pull | `pnpm build:core` |

### 8.2 Cache Clearing

```bash
# Clear all caches
pnpm clean

# Clear specific caches
rm -rf node_modules/.cache
rm -rf apps/mobile/.expo
watchman watch-del-all
```

### 8.3 Getting Help

1. Check existing issues on GitHub
2. Search project documentation
3. Ask in team Slack #lunar-calendar-dev
4. Create new issue with reproduction steps
