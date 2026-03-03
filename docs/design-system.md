# Design System — Lịch Âm Việt

Phong cách **Soft UI Evolution** kết hợp yếu tố mỹ thuật truyền thống Việt Nam.

---

## Color Palette

```css
:root {
  /* Backgrounds */
  --color-background: #F5ECD7;  /* Giấy dó ấm — rice paper */
  --color-card:       #FAF3E4;  /* Ngà trắng — ivory */

  /* Brand */
  --color-primary:    #8B1A1A;  /* Sơn mài đỏ trầm — dark lacquer red */
  --color-secondary:  #5C3317;  /* Gỗ trầm — dark wood */
  --color-accent:     #C9A84C;  /* Vàng cổ — antique gold */

  /* Text */
  --color-text:       #2C1810;  /* Mực nho — ink dark */
  --color-text-muted: #8B7355;  /* Muted brown */

  /* Border */
  --color-border:     #E8D5B0;  /* Light gold */

  /* Status */
  --color-hoang-dao:  #2D6A4F;  /* Hoàng Đạo — forest green */
  --color-hac-dao:    #C62828;  /* Hắc Đạo — deep red */
  --color-ram:        #8B1A1A;  /* Ngày Rằm / Mùng 1 */
}
```

### Anti-patterns — Tuyệt Đối KHÔNG Dùng

| ❌ Sai | ✅ Đúng |
|--------|---------|
| `#FF0000` (Chinese red) | `#8B1A1A` (sơn mài đỏ trầm) |
| AI purple / pink gradient | Warm cream gradient |
| Dark mode | Light mode only |
| Rounded pill (`rounded-full`) | `border-radius: 8px` |
| Emoji icons (📅 🌙) | Lucide React SVG icons |
| Dense layout | Breathing room, white space |

---

## Typography

```css
/* Google Fonts — phải import trong globals.css */
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

:root {
  --font-display: 'Lora', Georgia, serif;
  --font-body:    'Be Vietnam Pro', -apple-system, sans-serif;
}
```

### Scale

| Token | Size | Font | Dùng cho |
|---|---|---|---|
| `--text-lunar-hero` | 80px | Lora Bold | Số ngày âm lịch (DayHero) |
| `--text-lunar-month` | 24px | Lora SemiBold | Tên tháng âm |
| `--text-can-chi` | 18px | Be Vietnam Pro SemiBold | Năm Can Chi |
| `--text-body` | 16px | Be Vietnam Pro | Body text |
| `--text-label` | 13px | Be Vietnam Pro | Labels muted |
| `--text-lunar-small` | 11px | Be Vietnam Pro | Ngày âm trong lưới tháng |

---

## Spacing & Layout

```css
:root {
  --radius-sm:  4px;
  --radius-md:  8px;   /* Default — dùng cho buttons, cards */
  --radius-lg:  12px;
  --radius-xl:  16px;

  --shadow-sm:  0 1px 3px rgba(44, 24, 16, 0.08);
  --shadow-md:  0 4px 12px rgba(44, 24, 16, 0.12);
  --shadow-lg:  0 8px 24px rgba(44, 24, 16, 0.16);
}
```

**Max width mobile-first**: `480px` (DayHero, DatePicker).

---

## Watermark — Trống Đồng Đông Sơn

```css
/* Áp dụng trong DayHero */
.dong-son-watermark {
  position: absolute;
  inset: 0;
  background-image: url('/dong-son-drum.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80%;
  opacity: 0.08;
  pointer-events: none;
}
```

---

## Component Guidelines

### Buttons

```css
.btn-primary {
  background-color: var(--color-primary);
  color: #FFF8F0;
  border-radius: var(--radius-md);  /* 8px — không dùng rounded-full */
  padding: 12px 24px;
  font-family: var(--font-body);
  font-weight: 600;
  transition: background-color 150ms ease, transform 100ms ease;
}

.btn-primary:hover {
  background-color: #6B1414;
  transform: translateY(-1px);
}
```

### Cards

```css
.card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: 20px;
}
```

### Badges

```css
.badge-hoang-dao {
  background-color: #D4EDDA;
  color: var(--color-hoang-dao);
  border: 1px solid #A3C9A8;
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

.badge-hac-dao {
  background-color: #FDECEA;
  color: var(--color-hac-dao);
  border: 1px solid #F0A9A9;
}
```

---

## Animations & Motion

```css
/* Slide transition cho DayHero */
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes slideOutLeft {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(-30px); }
}

.day-enter { animation: slideInRight 200ms ease-out; }
.day-exit  { animation: slideOutLeft 200ms ease-out; }

/* Stagger fade-in khi load trang */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.stagger-1 { animation: fadeInUp 300ms ease-out 0ms   both; }
.stagger-2 { animation: fadeInUp 300ms ease-out 80ms  both; }
.stagger-3 { animation: fadeInUp 300ms ease-out 160ms both; }
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Tailwind Config

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        background: '#F5ECD7',
        card:       '#FAF3E4',
        primary:    '#8B1A1A',
        secondary:  '#5C3317',
        accent:     '#C9A84C',
        ink:        '#2C1810',
        border:     '#E8D5B0',
        muted:      '#8B7355',
      },
      fontFamily: {
        display: ['Lora', 'Georgia', 'serif'],
        body:    ['Be Vietnam Pro', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
};
```

---

## Accessibility Checklist

- [ ] Text contrast ≥ 4.5:1 (WCAG AA) — kiểm tra với [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ ] Focus states visible (outline `2px solid var(--color-primary)`)
- [ ] Tất cả interactive elements có `cursor-pointer`
- [ ] Hover transition: 150–300ms
- [ ] `aria-label` cho icon-only buttons
- [ ] `lang="vi"` trên thẻ `<html>`
- [ ] `prefers-reduced-motion` được respect

---

## Icons

Dùng **Lucide React** — không dùng emoji.

```tsx
import { Calendar, ChevronLeft, ChevronRight, Bell, Plus } from 'lucide-react';

// Kích thước chuẩn
<Calendar size={20} strokeWidth={1.5} color="var(--color-primary)" />
```

| Icon | Dùng cho |
|------|----------|
| `Calendar` | AppBar, navigation |
| `ChevronLeft/Right` | Prev/Next tháng, ngày |
| `Bell` | Notifications |
| `Plus` | FAB, thêm sự kiện |
| `Clock` | Giờ Hoàng Đạo |
| `Star` | Ngày tốt |
