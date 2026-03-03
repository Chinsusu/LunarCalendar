# AI Prompts — Google Antigravity

Bộ prompt được thiết kế theo chuẩn **UI UX Pro Max** ([nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)) cho **Google Antigravity** và các AI code editor hỗ trợ skill-based prompting.

**Setup:** `uipro init --ai antigravity` trong project folder. Sau đó dùng các prompt dưới đây.

---

## 8.1 Design System Generation

### Prompt: Khởi Tạo Design System

```
Build the Lịch Âm Việt (Vietnamese Lunar Calendar) web application.

PRODUCT TYPE: Vietnamese Lunar Calendar — Cultural Heritage App
TARGET: Vietnamese users for daily lunar calendar, ancestral death anniversaries,
        Buddhist ceremony scheduling, auspicious day selection.

DESIGN SYSTEM (DO NOT DEVIATE):
  Style:       Soft UI Evolution with Vietnamese Traditional elements
  Background:  #F5ECD7  (warm cream — rice paper / giấy dó)
  Primary:     #8B1A1A  (dark lacquer red — sơn mài đỏ trầm)
  Secondary:   #5C3317  (dark wood — gỗ trầm)
  Accent Gold: #C9A84C  (antique gold — vàng cổ)
  Text:        #2C1810  (ink dark — mực nho)
  Card:        #FAF3E4  (ivory — ngà trắng)
  Border:      #E8D5B0  (light gold)
  Font Display: Lora (serif) — for large lunar date numbers
  Font Body:    Be Vietnam Pro — designed for Vietnamese diacritics
  Watermark:    Đông Sơn Bronze Drum SVG, opacity 8%, centered

ANTI-PATTERNS TO AVOID:
  - Chinese red (#FF0000) — use dark lacquer red only
  - AI purple/pink gradients
  - Dark mode
  - Rounded pill buttons (use 8px radius only)
  - Emojis as icons (use Lucide icons)
  - Dense information without breathing room
```

---

## 8.2 Component-Specific Prompts

### Prompt: DayHero Component

```
Create a React component <DayHero> for Vietnamese Lunar Calendar.

LAYOUT (mobile-first, max-width: 480px):
  - Relative container with Đông Sơn drum watermark (SVG, opacity 8%, centered)
  - Large lunar day number: 80px, Lora bold, color #8B1A1A
  - Month name: "Tháng Hai" 24px Lora semibold, below number
  - Label "(Âm)" muted, 13px
  - Year Can Chi: "Năm Bính Ngọ" 18px Be Vietnam Pro semibold, #8B1A1A
  - Label "(Can Chi)" muted below

MOTION:
  - On date change: slide-out current, slide-in new (200ms ease-out)
  - Page load: stagger fade-in (300ms, 80ms delay per element)

PROPS:
  interface DayHeroProps {
    lunarDay: number;
    lunarMonth: string; // "Tháng Hai"
    lunarYear: string;  // "Bính Ngọ"
    solarDate: string;  // "Thứ Ba, ngày 3 tháng 3 năm 2026"
  }
```

---

### Prompt: LunarDatePicker Component

```
Create a custom <LunarDatePicker> component — Vietnamese lunar date selector.

UX PATTERN: iOS-style drum roll spinner (3 columns)
  Column 1: Day (1 to lunarDaysInMonth)
  Column 2: Month (Tháng 1 to 12, with "(Nhuận)" suffix if leap)
  Column 3: Year (current year ± 5)

BEHAVIOR:
  - On month/year change: recalculate max day (29 or 30)
  - Show leap month toggle when applicable
  - Real-time preview: "= Thứ 3, 03/03/2026 (Dương lịch)"
  - Haptic feedback on mobile (navigator.vibrate)

STYLING: Match design system — paper background, primary red selected item,
         gradient fade top/bottom for depth effect
```

---

### Prompt: Monthly Calendar View

```
Create <MonthCalendar> — Vietnamese lunar calendar month grid.

GRID: 7 columns (Mon-Sun), variable rows

EACH DAY CELL shows:
  - Top: Gregorian day number (large, 16px)
  - Bottom: Lunar day number (small, 11px, muted color)
  - Dot indicator if user has events
  - Gold underline for Hoàng Đạo days
  - Red highlight for Rằm (15) and Mùng 1 (1)
  - Red circle for today

HEADER: "Tháng 3 / 2026" with prev/next month arrows
WEEKDAY LABELS: "T2 T3 T4 T5 T6 T7 CN" (Vietnamese)
```

---

## 8.3 Page-Level Prompts

### Prompt: Trang Chủ — Lịch Ngày

```
Build the main day view page for Lịch Âm Việt PWA.

STACK: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui

PAGE STRUCTURE (top to bottom):
  1. AppBar: "LỊCH ÂM VIỆT" logo left, calendar icon + menu right
  2. DayHero: lunar date hero section with watermark
  3. DayInfoCard: white card, rounded-xl, shadow-sm
     - Row 1: Hoàng Đạo badge (green) or Hắc Đạo (red)
     - Row 2: Can Chi day + month with hourglass icon
     - Row 3: Lucky hours list with clock icon
  4. NotesSection: "GHI CHÚ HÔM NAY" title
     - System notes (auto-generated, italic)
     - User notes with checkbox
     - "+ Add note" inline input
     - FAB button (+) bottom right
  5. BottomNav: Lịch Ngày | Lịch Tháng | Sự Kiện

NAVIGATION: Swipe left/right on DayHero to change date.
            Keyboard arrow keys on desktop.
```

---

## 8.4 Full App Initialization

### Prompt: Khởi Tạo Toàn Bộ Project

```
Initialize complete Lịch Âm Việt Next.js project with full design system.

TECH STACK:
  - Next.js 14 App Router + TypeScript strict
  - Tailwind CSS with custom config (Vietnamese traditional palette)
  - shadcn/ui as base component library
  - Dexie.js for IndexedDB offline storage
  - next-pwa for PWA + service worker
  - Lucide React for icons

CREATE:
  1. tailwind.config.ts with all color tokens
  2. app/globals.css with CSS variables + Be Vietnam Pro + Lora import
  3. lib/lunar.ts — WASM loader wrapper with TypeScript types
  4. lib/db.ts — Dexie schema: events + dailyNotes + syncQueue
  5. components/ui/ — override shadcn with Vietnamese theme
  6. public/manifest.json — PWA manifest in Vietnamese

NAMING CONVENTION:
  - Components: PascalCase Vietnamese names OK (DayHero, LunarDatePicker)
  - Files: kebab-case
  - CSS variables: --color-*, --font-*, --radius-*, --shadow-*
```

---

## Tips Dùng Prompt Hiệu Quả

| Tip | Chi Tiết |
|-----|----------|
| **Luôn kèm design system** | Paste section màu sắc + font vào mỗi prompt lớn |
| **Chỉ định rõ ANTI-PATTERNS** | Liệt kê cụ thể để AI không tự ý dùng emoji hay dark mode |
| **Mobile-first** | Luôn ghi `max-width: 480px` cho components chính |
| **Dùng tên tiếng Việt** | `DayHero`, `LunarDatePicker` — AI sẽ giữ nguyên naming convention |
| **Chỉ định PROPS interface** | Giúp AI generate TypeScript types chính xác ngay lần đầu |
| **Tách nhỏ prompt** | Mỗi component một prompt riêng — đừng gộp nhiều components vào 1 prompt |
