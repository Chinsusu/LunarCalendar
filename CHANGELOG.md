# Changelog

Tất cả thay đổi đáng chú ý của dự án **Lịch Âm Việt** được ghi lại tại đây.

Định dạng theo [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
và dự án tuân theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned — Sprint 1.5
- `LunarDatePicker` iOS-style drum roll (3 cột: Ngày / Tháng / Năm)
- `MonthCalendar` lưới tháng với Hoàng Đạo, Rằm, Mùng 1
- `EventForm` tạo/sửa sự kiện âm lịch
- IndexedDB schema (Dexie.js): `events`, `dailyNotes`, `syncQueue`
- Web Push Notification cho sự kiện
- Offline PWA: service worker caching

---

## [0.1.0] — 2026-03-03

### Sprint 1.0 — Foundation

#### Added
- Khởi tạo dự án Next.js 14 App Router + TypeScript strict
- Design system: Tailwind CSS custom tokens (Vietnamese traditional palette)
- `DayHero` component — hiển thị ngày âm lịch lớn, watermark trống đồng
- `DayInfoCard` — Hoàng Đạo/Hắc Đạo badge, Can Chi, giờ tốt
- `BottomNav` — điều hướng Lịch Ngày / Lịch Tháng / Sự Kiện
- Tích hợp WASM lunar engine (chuyển đổi dương ↔ âm lịch)
- Can Chi: năm, tháng, ngày, giờ
- Giờ Hoàng Đạo theo 12 Chi
- PWA manifest + next-pwa setup
- `lib/lunar.ts` — WASM loader với TypeScript types
- `lib/db.ts` — Dexie schema cơ bản
- Font: Lora (display) + Be Vietnam Pro (body)
- Responsive layout: 375px, 768px, 1280px
- Tài liệu dự án: README.md, docs/

#### Technical
- Thuật toán âm lịch: port từ [Hồ Ngọc Đức](https://www.informatik.uni-leipzig.de/~duc/amlich/calrules_v.html)
- Test suite: 1000+ cases cho converter âm ↔ dương
- Kiểm tra năm nhuận: 2023, 2025, 2033

---

[Unreleased]: https://github.com/your-repo/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-repo/releases/tag/v0.1.0
