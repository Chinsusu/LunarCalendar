# Kiến Trúc Hệ Thống — Lịch Âm Việt

## Tổng Quan

**Lịch Âm Việt** là Progressive Web App (PWA) hoạt động hoàn toàn **offline-first**. Toàn bộ tính toán âm lịch chạy trên client thông qua WebAssembly, dữ liệu sự kiện lưu tại IndexedDB.

---

## Sơ Đồ Kiến Trúc

```
┌─────────────────────────────────────────────┐
│                  Browser                    │
│                                             │
│  ┌──────────────┐    ┌──────────────────┐   │
│  │  Next.js 14  │    │  Service Worker  │   │
│  │  App Router  │    │  (next-pwa)      │   │
│  └──────┬───────┘    └────────┬─────────┘   │
│         │                    │              │
│  ┌──────▼───────┐    ┌───────▼──────────┐   │
│  │  Components  │    │   Cache Storage  │   │
│  │  (React)     │    │   (Assets/API)   │   │
│  └──────┬───────┘    └──────────────────┘   │
│         │                                   │
│  ┌──────▼──────────────────────────────┐    │
│  │           lib/                      │    │
│  │  ┌──────────────┐ ┌──────────────┐  │    │
│  │  │  lunar.ts    │ │    db.ts     │  │    │
│  │  │  (WASM wrap) │ │  (Dexie.js)  │  │    │
│  │  └──────┬───────┘ └──────┬───────┘  │    │
│  └─────────┼────────────────┼──────────┘    │
│            │                │               │
│  ┌─────────▼──────┐ ┌───────▼──────────┐   │
│  │  lunar.wasm    │ │   IndexedDB      │   │
│  │  (âm lịch)     │ │  events/notes    │   │
│  └────────────────┘ └──────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
              │ Web Push
     ┌────────▼────────┐
     │  Push Server    │
     │  (optional)     │
     └─────────────────┘
```

---

## Các Lớp Hệ Thống

### 1. Presentation Layer — `app/` & `components/`

| Component | Trách Nhiệm |
|---|---|
| `DayHero` | Hiển thị ngày âm lịch lớn, watermark, animation |
| `LunarDatePicker` | Bộ chọn ngày âm iOS-style (drum roll 3 cột) |
| `MonthCalendar` | Lưới lịch tháng 7 cột |
| `DayInfoCard` | Hoàng Đạo/Hắc Đạo, Can Chi, giờ tốt |
| `BottomNav` | Điều hướng chính |
| `EventForm` | Form tạo/sửa sự kiện |

**Pages (App Router):**
```
app/
├── page.tsx          → /          (Lịch Ngày)
├── thang/page.tsx    → /thang     (Lịch Tháng)
└── su-kien/page.tsx  → /su-kien   (Sự Kiện)
```

---

### 2. Business Logic Layer — `lib/`

#### `lib/lunar.ts` — WASM Lunar Engine
- Load và khởi tạo `lunar.wasm`
- Export TypeScript-typed API:
  ```ts
  solarToLunar(year, month, day): LunarDate
  lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeap): SolarDate
  getCanChi(year, month, day, hour): CanChi
  getHoangDao(lunarDay, lunarMonth): HoangDaoHour[]
  ```

#### `lib/db.ts` — IndexedDB Schema (Dexie.js)
```ts
class LichAmDB extends Dexie {
  events!: Table<Event>       // Sự kiện cá nhân
  dailyNotes!: Table<Note>    // Ghi chú hàng ngày
  syncQueue!: Table<SyncItem> // Queue đồng bộ (tương lai)
}
```

---

### 3. Storage Layer

| Storage | Dữ Liệu | Công Nghệ |
|---|---|---|
| IndexedDB | Events, Notes, SyncQueue | Dexie.js |
| Cache Storage | JS bundle, WASM, fonts, icons | Service Worker |
| Memory | Lunar calculations (session) | JS |

---

### 4. PWA Layer

```
public/
├── manifest.json      # PWA metadata
├── icons/             # 192x192, 512x512
└── dong-son-drum.svg  # Watermark

next.config.js → next-pwa:
├── Service Worker     # Auto-generated
├── Offline fallback   # /offline page
└── Workbox strategies # CacheFirst (assets), NetworkFirst (API)
```

---

## Data Flow — Hiển Thị Ngày Hôm Nay

```
1. User mở app
        │
2. Service Worker trả về cached shell (< 100ms offline)
        │
3. app/page.tsx lấy ngày hôm nay (new Date())
        │
4. lunar.ts → WASM: solarToLunar(today) → LunarDate
        │
5. lunar.ts: getCanChi(today) → CanChi
        │
6. lunar.ts: getHoangDao(lunarDate) → HoangDaoHour[]
        │
7. Render DayHero + DayInfoCard
        │
8. db.ts: query dailyNotes cho ngày hôm nay → hiển thị ghi chú
```

---

## Chiến Lược Offline

| Loại tài nguyên | Strategy | TTL |
|---|---|---|
| JS/CSS/WASM bundle | CacheFirst | Forever (versioned) |
| Fonts (Google) | CacheFirst | 1 năm |
| Icons/SVG | CacheFirst | Forever |
| API calls (nếu có) | NetworkFirst | Fallback cache |

---

## Quyết Định Kiến Trúc (ADR)

### ADR-001: Tại sao dùng WASM cho thuật toán âm lịch?
- **Lý do**: Thuật toán âm lịch cần tính chính xác cao (float-point), WASM nhanh hơn JS thuần ~2-5x
- **Thay thế đã xem xét**: JS port — nhưng rủi ro sai số do float

### ADR-002: Tại sao dùng Dexie.js thay vì raw IndexedDB?
- **Lý do**: API Promise-based sạch hơn, query builder mạnh, TypeScript support tốt
- **Thay thế đã xem xét**: localForage — nhưng thiếu query phức tạp

### ADR-003: Tại sao Next.js 14 App Router?
- **Lý do**: Server Components giảm bundle size, built-in PWA support, ecosystem tốt
- **Thay thế đã xem xét**: Vite SPA — nhưng thiếu SSG/ISR cho SEO
