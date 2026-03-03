# 🗓 Lịch Âm Việt

> Ứng dụng lịch âm Việt Nam hiện đại — Progressive Web App (PWA)

[![Next.js 14](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://typescriptlang.org)
[![PWA](https://img.shields.io/badge/PWA-ready-purple?logo=googlechrome)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/license-Internal-gray)](#)

---

## 📖 Giới Thiệu

**Lịch Âm Việt** là ứng dụng lịch âm dương lịch dành riêng cho người Việt, hỗ trợ:

- 📅 Tra cứu ngày âm lịch / dương lịch theo thời gian thực
- 🎋 Hiển thị Can Chi (ngày, tháng, năm, giờ)
- ⭐ Xem giờ Hoàng Đạo / Hắc Đạo hàng ngày
- 📌 Ghi chú sự kiện cá nhân (giỗ kị, lễ Phật, ngày tốt)
- 🔔 Nhắc nhở qua Web Push Notification
- 📴 Hoạt động offline hoàn toàn (PWA + IndexedDB)

---

## 🛠 Tech Stack

| Layer | Công nghệ |
|---|---|
| Framework | Next.js 14 App Router + TypeScript strict |
| Styling | Tailwind CSS + shadcn/ui (custom Vietnamese theme) |
| Offline Storage | Dexie.js (IndexedDB) |
| PWA | next-pwa + Service Worker |
| Lunar Engine | WebAssembly (WASM) |
| Icons | Lucide React |
| Fonts | Lora (display) + Be Vietnam Pro (body) |

---

## 🚀 Bắt Đầu Nhanh

### Yêu Cầu
- Node.js >= 18.17
- npm >= 9 hoặc pnpm >= 8

### Cài Đặt

```bash
# Clone dự án
git clone git@github.com:Chinsusu/LunarCalendar.git
cd LunarCalendar

# Cài dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

### Build Production

```bash
npm run build
npm start
```

---

## 📁 Cấu Trúc Dự Án

```
LunarCalendar/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Trang chủ (Lịch Ngày)
│   ├── thang/              # Lịch Tháng
│   └── su-kien/            # Sự kiện & ghi chú
├── components/
│   ├── ui/                 # shadcn/ui overrides (Vietnamese theme)
│   ├── DayHero.tsx         # Hero section hiển thị ngày âm lịch
│   ├── LunarDatePicker.tsx # iOS-style drum roll picker
│   ├── MonthCalendar.tsx   # Lưới lịch tháng
│   ├── DayInfoCard.tsx     # Card thông tin ngày (Can Chi, Giờ tốt)
│   └── BottomNav.tsx       # Navigation bar
├── lib/
│   ├── lunar.ts            # WASM loader + TypeScript types
│   ├── db.ts               # Dexie schema (events, notes, syncQueue)
│   └── utils.ts            # Helper functions
├── hooks/                  # Custom React hooks
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── icons/              # App icons
│   └── dong-son-drum.svg   # Watermark trống đồng
├── docs/                   # Tài liệu kỹ thuật
│   ├── architecture.md
│   ├── lunar-algorithm.md
│   ├── design-system.md
│   ├── coding-standards.md
│   ├── api.md
│   └── deploy-checklist.md
├── .agent/workflows/       # AI agent workflows
│   ├── build.md
│   └── release.md
├── tailwind.config.ts
└── next.config.js
```

---

## 🎨 Design System

Phong cách **Soft UI Evolution** kết hợp yếu tố truyền thống Việt Nam:

| Token | Màu | Ý Nghĩa |
|---|---|---|
| `--color-background` | `#F5ECD7` | Giấy dó ấm |
| `--color-primary` | `#8B1A1A` | Sơn mài đỏ trầm |
| `--color-secondary` | `#5C3317` | Gỗ trầm |
| `--color-accent` | `#C9A84C` | Vàng cổ |
| `--color-text` | `#2C1810` | Mực nho |
| `--color-card` | `#FAF3E4` | Ngà trắng |

Chi tiết → [docs/design-system.md](docs/design-system.md)

---

## 🌙 Thuật Toán Âm Lịch

Sử dụng WASM để tính toán:
- Chuyển đổi dương ↔ âm lịch (Việt Nam time zone UTC+7)
- Năm nhuận: 2023 (nhuận tháng 2), 2025 (nhuận tháng 6), 2033 (nhuận tháng 11)
- Can Chi: năm / tháng / ngày / giờ
- Giờ Hoàng Đạo theo 12 Chi

Tham khảo: [Đổi lịch âm dương (Hồ Ngọc Đức)](https://www.informatik.uni-leipzig.de/~duc/amlich/calrules_v.html)

Chi tiết → [docs/lunar-algorithm.md](docs/lunar-algorithm.md)

---

## 📊 Performance Targets

| Metric | Mục Tiêu |
|---|---|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3.0s |
| WASM Load (cold) | < 1.0s |
| WASM Load (cached) | < 100ms |
| Lighthouse Performance | > 85 |
| Lighthouse Accessibility | > 90 |
| JS Bundle (gzipped) | < 200KB |

---

## 🔄 Workflows

| Workflow | Mô Tả |
|---|---|
| `/build` | Build binary/production bundle |
| `/release` | Update changelog, tag version, commit & push |

---

## 📚 Tài Liệu

| File | Nội Dung |
|---|---|
| [docs/architecture.md](docs/architecture.md) | Kiến trúc hệ thống |
| [docs/lunar-algorithm.md](docs/lunar-algorithm.md) | Thuật toán âm lịch |
| [docs/design-system.md](docs/design-system.md) | Design tokens & guidelines |
| [docs/coding-standards.md](docs/coding-standards.md) | Coding standards |
| [docs/ai-prompts.md](docs/ai-prompts.md) | AI Prompts cho Google Antigravity |
| [docs/api.md](docs/api.md) | Lib & API reference |
| [docs/deploy-checklist.md](docs/deploy-checklist.md) | Checklist trước deploy |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Hướng dẫn đóng góp |
| [CHANGELOG.md](CHANGELOG.md) | Lịch sử thay đổi |

---

## 📄 Giấy Phép

Tài liệu nội bộ — **Internal Use Only** — © 2026 Lịch Âm Việt Team
