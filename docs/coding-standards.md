# Coding Standards — Lịch Âm Việt

Tài liệu này là nguồn tham chiếu duy nhất về quy chuẩn code cho dự án.  
Mọi code được merge vào `main` **phải** tuân thủ 100%.

---

## 1. TypeScript

### Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Quy Tắc

| ✅ Đúng | ❌ Sai |
|---------|--------|
| `interface` cho object shapes | `type` cho object shapes |
| Named exports | Default exports cho components |
| Explicit return types cho functions phức tạp | `any` type |
| `const` khi không tái gán | `let` khi không cần |
| `??` (nullish coalescing) | `\|\|` cho falsy check |
| Optional chaining `?.` | Manual null checks |

### Naming Convention

```typescript
// Components: PascalCase
export function DayHero() {}
export function LunarDatePicker() {}

// Files: kebab-case
// day-hero.tsx
// lunar-date-picker.tsx

// Functions & variables: camelCase
const getLunarDate = () => {};
let currentMonth = 2;

// Constants: UPPER_SNAKE_CASE
const MAX_YEAR_RANGE = 5;
const VN_TIMEZONE_OFFSET = 7;

// CSS variables: --prefix-name
// --color-primary, --font-display, --radius-md

// Types & Interfaces: PascalCase
interface LunarDate {}
type CanChiString = string;

// Enums: PascalCase, values UPPER_SNAKE_CASE
enum LunarChi {
  TY = 'TY',
  SUU = 'SUU',
}
```

---

## 2. React & Next.js

### Component Structure

```typescript
// Thứ tự trong file component:
// 1. Imports
// 2. Types/Interfaces
// 3. Constants (ngoài component)
// 4. Component function
// 5. Sub-components (nếu nhỏ và chỉ dùng trong file này)
// 6. Exports

import { useState, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { solarToLunar } from '@/lib/lunar';
import type { LunarDate } from '@/lib/lunar';

const DEFAULT_YEAR = 2026;

interface DayHeroProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function DayHero({ date, onDateChange }: DayHeroProps) {
  // state
  const [isAnimating, setIsAnimating] = useState(false);

  // derived values
  const lunar = solarToLunar(date.getFullYear(), date.getMonth() + 1, date.getDate());

  // callbacks
  const handleNext = useCallback(() => {
    // ...
  }, [date, onDateChange]);

  return <div>{/* JSX */}</div>;
}
```

### Server vs Client Components

```typescript
// Server Component (mặc định trong App Router) — ưu tiên dùng
// app/page.tsx — KHÔNG có 'use client'
export default async function HomePage() {
  return <DayHero date={new Date()} />;
}

// Client Component — chỉ khi cần state, event handlers, hooks
// components/day-hero.tsx
'use client';

import { useState } from 'react';
```

### Quy Tắc Component

- Mỗi component một file — không bundle nhiều components "nặng" vào 1 file
- Props interface phải có JSDoc cho props không rõ nghĩa
- Không truyền raw `style` object — dùng CSS variables hoặc Tailwind classes
- Không hardcode màu — chỉ dùng `var(--color-*)` hoặc Tailwind tokens

---

## 3. CSS & Tailwind

### Thứ Tự Ưu Tiên

1. **CSS Variables** từ design system (`var(--color-primary)`)
2. **Tailwind utilities** với custom tokens (`text-primary`, `bg-background`)
3. **CSS modules** cho component-specific styles phức tạp
4. **Inline style** — **CHỈ** cho dynamic values (ví dụ: animation delay)

### Quy Tắc Bắt Buộc

```css
/* ✅ ĐÚNG — dùng design token */
.btn { background: var(--color-primary); border-radius: var(--radius-md); }

/* ❌ SAI — hardcode màu */
.btn { background: #8B1A1A; border-radius: 8px; }

/* ✅ ĐÚNG — transition đúng */
.btn { transition: background-color 150ms ease, transform 100ms ease; }

/* ❌ SAI — transition quá dài */
.btn { transition: all 500ms; }
```

### Forbidden Patterns

```css
/* ❌ TUYỆT ĐỐI không dùng */
border-radius: 9999px;  /* pill button — dùng var(--radius-md) */
color: #FF0000;         /* Chinese red — dùng var(--color-primary) */
transition: all ...;    /* quá rộng — chỉ transition property cụ thể */
```

### Responsive

```css
/* Mobile-first — ưu tiên màn hình nhỏ */
.container { width: 100%; }

@media (min-width: 768px) { .container { max-width: 768px; } }
@media (min-width: 1280px) { .container { max-width: 1280px; } }

/* Breakpoints chuẩn: 375px | 768px | 1024px | 1280px */
```

---

## 4. File & Folder Structure

```
components/
├── ui/              # shadcn/ui overrides — không đổi logic, chỉ đổi style
├── DayHero.tsx      # Feature components — PascalCase
├── MonthCalendar.tsx
└── ...

lib/
├── lunar.ts         # Pure functions — không side effects
├── db.ts            # Database layer
├── push.ts          # Web Push
└── utils.ts         # Helpers

hooks/
├── useToday.ts      # Custom hooks — prefix 'use'
├── useLunarDate.ts
└── useEvents.ts

app/
├── layout.tsx       # Root layout — Server Component
├── page.tsx         # Route pages
└── ...
```

---

## 5. Import Order

```typescript
// 1. React & Next.js
import { useState, useCallback, type FC } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { Calendar } from 'lucide-react';
import Dexie from 'dexie';

// 3. Internal — lib/
import { solarToLunar } from '@/lib/lunar';
import { db } from '@/lib/db';

// 4. Internal — components/
import { DayInfoCard } from '@/components/DayInfoCard';

// 5. Internal — hooks/
import { useToday } from '@/hooks/useToday';

// 6. Types
import type { LunarDate, CanChi } from '@/lib/lunar';

// 7. Styles
import styles from './day-hero.module.css';
```

---

## 6. Testing Standards

### File Naming
```
lib/lunar.ts         → lib/__tests__/lunar.test.ts
components/DayHero   → components/__tests__/DayHero.test.tsx
```

### Test Structure

```typescript
describe('solarToLunar', () => {
  describe('năm nhuận 2023', () => {
    it('ngày trước tháng 2 nhuận', () => {
      const result = solarToLunar(2023, 3, 21);
      expect(result).toMatchObject({ day: 1, month: 2, isLeapMonth: false });
    });

    it('ngày đầu tháng 2 nhuận', () => {
      const result = solarToLunar(2023, 4, 20);
      expect(result).toMatchObject({ day: 1, month: 2, isLeapMonth: true });
    });
  });
});
```

### Coverage Requirements
- Business logic (`lib/`): **≥ 80%** coverage
- UI components: Test interaction (click, swipe), không test snapshot
- Hooks: Test với `renderHook` từ @testing-library/react

---

## 7. Git Commit Convention

Format: `<type>(<scope>): <mô tả>` — chi tiết xem [CONTRIBUTING.md](../CONTRIBUTING.md)

```bash
# ✅ Đúng
git commit -m "feat(lunar): thêm tính giờ Hoàng Đạo"
git commit -m "fix(DayHero): sửa slide animation khi đổi ngày nhanh"
git commit -m "test(lunar): thêm 500 cases năm nhuận 2025"

# ❌ Sai
git commit -m "update"
git commit -m "fix bug"
git commit -m "WIP"
```

---

## 8. Performance Standards

| Quy Tắc | Chi Tiết |
|---|---|
| Không block main thread | WASM load async, không sync |
| Memoize tính toán nặng | `useMemo` cho lunar calculations |
| Lazy load WASM | Chỉ load khi app mount |
| Image optimization | Dùng `next/image`, SVG inline |
| Bundle splitting | Dynamic import cho heavy components |

```typescript
// ✅ Đúng — lazy load WASM
useEffect(() => {
  initLunar().then(() => setReady(true));
}, []);

// ✅ Đúng — memoize expensive calculation
const hoangDaoHours = useMemo(
  () => getHoangDao(lunar.day, lunar.month),
  [lunar.day, lunar.month]
);
```

---

## 9. Accessibility Standards

Tuân thủ **WCAG 2.1 Level AA**:

```typescript
// ✅ Icon-only button PHẢI có aria-label
<button aria-label="Ngày tiếp theo" onClick={handleNext}>
  <ChevronRight size={20} />
</button>

// ✅ Badge status PHẢI có role
<span role="status" aria-label="Ngày Hoàng Đạo">Hoàng Đạo</span>

// ✅ Date picker PHẢI accessible
<div role="spinbutton" aria-label="Chọn ngày" aria-valuenow={day} 
     aria-valuemin={1} aria-valuemax={30}>
```

---

## 10. Code Review Checklist

Tự review trước khi tạo PR:

- [ ] Không có `any` type
- [ ] Không có `console.log` (chỉ dùng logger)
- [ ] Tất cả strings Việt Nam encode đúng UTF-8
- [ ] Màu sắc dùng design token
- [ ] Không dùng emoji làm icon
- [ ] Test coverage ≥ 80% cho business logic
- [ ] Accessibility attributes đầy đủ
- [ ] Responsive trên 375px và 1280px
- [ ] `prefers-reduced-motion` được respect
- [ ] TypeScript compile không có errors
