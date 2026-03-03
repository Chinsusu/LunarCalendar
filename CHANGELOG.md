# Changelog

Tất cả thay đổi đáng chú ý của dự án **Lịch Âm Việt** được ghi lại tại đây.

Định dạng theo [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
và dự án tuân theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [0.1.0] — 2026-03-03

### Sprint 1.0 + 1.5 — Foundation & Core Features

#### Added
- Khởi tạo Next.js 14 App Router + TypeScript strict
- Design system: Tailwind CSS custom tokens (Vietnamese traditional palette — giấy dó, sơn mài, vàng cổ)
- `lib/lunar.ts` — thuật toán âm lịch JS thuần (solarToLunar, lunarToSolar, Can Chi, Hoàng Đạo)
- `lib/db.ts` — Dexie IndexedDB schema: `events`, `dailyNotes`, `syncQueue`
- `DayHero` — hiển thị ngày âm lịch lớn, watermark trống đồng Đông Sơn, swipe & phím ←→
- `DayInfoCard` — Hoàng Đạo/Hắc Đạo badge, Can Chi ngày/tháng/năm, giờ tốt
- `LunarDatePicker` — iOS drum roll 3 cột (Ngày/Tháng/Năm), hỗ trợ tháng nhuận, haptic, preview dương lịch
- `MonthCalendar` — lưới 7 cột, ngày âm nhỏ, Hoàng Đạo gold underline, Rằm/Mùng 1 đỏ, event dot
- `EventForm` — tạo sự kiện âm lịch, lặp hàng năm, Web Push toggle
- `NotesSection` — ghi chú ngày checkbox CRUD (IndexedDB)
- `BottomNav` — điều hướng 3 tab với active state indicator
- Trang chủ Lịch Ngày — AppBar, DayHero, DayInfoCard, Notes, FAB, LunarDatePicker overlay
- Trang Lịch Tháng — MonthCalendar đầy đủ, prev/next month
- Trang Sự Kiện — filter tháng âm lịch, danh sách, EventForm FAB
- PWA manifest tiếng Việt
- hooks: `useLunarDate`, `useNotes`, `useEvents`
- Tài liệu: README, CHANGELOG, CONTRIBUTING, docs/architecture, docs/lunar-algorithm, docs/design-system, docs/coding-standards, docs/ai-prompts, docs/api, docs/deploy-checklist
- Workflows: `build.md`, `release.md`

#### Technical
- Thuật toán âm lịch: port JS từ [Hồ Ngọc Đức](https://www.informatik.uni-leipzig.de/~duc/amlich/calrules_v.html)
- Kiểm tra năm nhuận: 2023 (T2), 2025 (T6), 2033 (T11)
- TypeScript strict — 0 errors
- Production build: Bundle JS 127 kB gzipped (target < 200 kB) ✓

---

[Unreleased]: https://github.com/Chinsusu/LunarCalendar/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Chinsusu/LunarCalendar/releases/tag/v0.1.0
