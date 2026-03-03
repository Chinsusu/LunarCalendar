# API & Lib Reference — Lịch Âm Việt

Tài liệu này mô tả các module trong `lib/` và cách sử dụng trong components.

---

## `lib/lunar.ts` — Lunar Engine

### Khởi Tạo

```typescript
import { initLunar, solarToLunar, getCanChi, getHoangDao } from '@/lib/lunar';

// Gọi một lần duy nhất tại root (app/layout.tsx hoặc Provider)
await initLunar();
```

### Types

```typescript
interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
  dayName: string;   // "Canh Thìn"
  monthName: string; // "Tháng Hai" | "Tháng Hai (Nhuận)"
  yearName: string;  // "Bính Ngọ"
}

interface CanChi {
  year: string;   // "Bính Ngọ"
  month: string;  // "Quý Mão"
  day: string;    // "Canh Thìn"
  hour: string;   // "Đinh Tý"
}

interface HoangDaoHour {
  chi: string;         // "Tý" | "Sửu" | ...
  startHour: number;   // Giờ bắt đầu (0-23)
  endHour: number;     // Giờ kết thúc (0-23)
  isHoangDao: boolean;
}
```

### Functions

```typescript
// Chuyển dương lịch → âm lịch
solarToLunar(year: number, month: number, day: number): LunarDate

// Chuyển âm lịch → dương lịch
lunarToSolar(
  lunarYear: number, 
  lunarMonth: number, 
  lunarDay: number, 
  isLeap?: boolean
): Date

// Can Chi đầy đủ của ngày
getCanChi(year: number, month: number, day: number, hour?: number): CanChi

// Giờ Hoàng Đạo/Hắc Đạo trong ngày
getHoangDao(lunarDay: number, lunarMonth: number): HoangDaoHour[]

// Số ngày trong tháng âm lịch (29 | 30)
daysInLunarMonth(lunarYear: number, lunarMonth: number, isLeap?: boolean): 29 | 30

// Tháng nhuận trong năm âm lịch (0 = không nhuận)
getLeapMonth(lunarYear: number): number
```

### Ví Dụ Sử Dụng

```typescript
// Lấy thông tin ngày hôm nay
const today = new Date();
const lunar = solarToLunar(
  today.getFullYear(),
  today.getMonth() + 1,
  today.getDate()
);
// → { day: 4, month: 2, year: 2026, isLeapMonth: false, yearName: "Bính Ngọ", ... }

// Lấy giờ Hoàng Đạo
const hours = getHoangDao(lunar.day, lunar.month);
const luckyHours = hours.filter(h => h.isHoangDao);
```

---

## `lib/db.ts` — IndexedDB (Dexie.js)

### Schema

```typescript
import Dexie, { Table } from 'dexie';

interface Event {
  id?: number;
  title: string;
  description?: string;

  // Âm lịch (để tính lặp hàng năm)
  lunarDay: number;
  lunarMonth: number;
  isLeapMonth: boolean;

  // Thông báo
  notifyEnabled: boolean;
  notifyDaysBefore: number;  // 0 = ngay hôm đó

  createdAt: Date;
  updatedAt: Date;
}

interface DailyNote {
  id?: number;
  solarDate: string;   // ISO date "2026-03-03"
  content: string;
  isChecked: boolean;
  isSystemNote: boolean;
  createdAt: Date;
}

interface SyncQueueItem {
  id?: number;
  operation: 'create' | 'update' | 'delete';
  table: 'events' | 'dailyNotes';
  data: unknown;
  createdAt: Date;
}

class LichAmDB extends Dexie {
  events!: Table<Event>;
  dailyNotes!: Table<DailyNote>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super('LichAmViet');
    this.version(1).stores({
      events:     '++id, lunarMonth, lunarDay',
      dailyNotes: '++id, solarDate',
      syncQueue:  '++id, createdAt',
    });
  }
}

export const db = new LichAmDB();
```

### Queries Thường Dùng

```typescript
import { db } from '@/lib/db';

// Lấy notes của ngày hôm nay
const todayStr = '2026-03-03';
const notes = await db.dailyNotes
  .where('solarDate').equals(todayStr)
  .toArray();

// Lấy tất cả events của tháng âm lịch
const events = await db.events
  .where('lunarMonth').equals(2)
  .toArray();

// Thêm note mới
await db.dailyNotes.add({
  solarDate: todayStr,
  content: 'Giỗ ông nội',
  isChecked: false,
  isSystemNote: false,
  createdAt: new Date(),
});

// Cập nhật
await db.dailyNotes.update(noteId, { isChecked: true });

// Xóa
await db.dailyNotes.delete(noteId);
```

---

## `lib/utils.ts` — Helpers

```typescript
// Format ngày dương lịch theo tiếng Việt
formatSolarDate(date: Date): string
// → "Thứ Ba, ngày 3 tháng 3 năm 2026"

// Format giờ địa chi
formatHour(hour: number): string
// → "07:00 – 09:00 (Thìn)"

// Chuyển số can chi sang chuỗi đầy đủ
getCanChiYear(year: number): string
// → "Bính Ngọ"

// Lấy element (CN) thứ trong tuần bằng tiếng Việt
getVietnameseDayOfWeek(date: Date): string
// → "Thứ Ba"

// Kiểm tra ngày Rằm (15) hay Mùng 1 (1)
isSpecialLunarDay(lunarDay: number): 'ram' | 'mung-mot' | null

// Clamping số ngày âm lịch khi đổi tháng
clampLunarDay(day: number, lunarYear: number, lunarMonth: number, isLeap: boolean): number
```

---

## Hooks (Custom React Hooks)

### `useToday()`

```typescript
// hooks/useToday.ts
function useToday(): {
  solarDate: Date;
  lunarDate: LunarDate;
  canChi: CanChi;
  hoangDaoHours: HoangDaoHour[];
}
```

### `useLunarDate(date: Date)`

```typescript
// Chuyển đổi một ngày dương lịch bất kỳ
function useLunarDate(date: Date): LunarDate | null
```

### `useEvents(lunarMonth: number)`

```typescript
// Lấy events theo tháng âm lịch
function useEvents(lunarMonth: number): Event[]
```

---

## PWA — Web Push

### Đăng Ký Notification

```typescript
// lib/push.ts
async function subscribePush(): Promise<PushSubscription | null> {
  if (!('Notification' in window)) return null;
  
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY,
  });
}
```

### Fallback iOS Safari < 16

```typescript
// Graceful degradation — không dùng Web Push
// Thay bằng in-app alert khi mở app
function scheduleInAppReminder(event: Event): void {
  // Lưu vào IndexedDB, check khi mở app
}
```
