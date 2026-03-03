# Thuật Toán Âm Lịch — Tài Liệu Kỹ Thuật

## Nguồn Tham Khảo

- **Thuật toán chính**: [Hồ Ngọc Đức — Đổi ngày dương lịch ra âm lịch Việt Nam](https://www.informatik.uni-leipzig.de/~duc/amlich/calrules_v.html)
- **Sách tham khảo**: Jean Meeus — *Astronomical Algorithms*, 2nd Edition
- **Ground truth**: Lịch Vạn Niên in ấn, Lịch Việt App

---

## Tổng Quan

Lịch âm Việt Nam là **âm dương lịch** (lunisolar calendar), không phải âm lịch thuần túy:
- **Ngày** dựa trên chu kỳ mặt trăng (~29.53 ngày/tháng)
- **Năm** căn chỉnh với năm mặt trời qua tháng nhuận
- **Múi giờ**: UTC+7 (Hà Nội) — khác lịch Trung Quốc (UTC+8)

---

## Các Khái Niệm Cốt Lõi

### 1. Tháng Âm Lịch
- Tháng đủ: **30 ngày**
- Tháng thiếu: **29 ngày**
- Xác định bởi vị trí điểm Sóc (New Moon) theo UTC+7

### 2. Năm Nhuận
Năm âm lịch có **13 tháng** thay vì 12, thêm 1 tháng nhuận.

| Năm | Tháng Nhuận |
|-----|-------------|
| 2023 | Tháng 2 nhuận |
| 2025 | Tháng 6 nhuận |
| 2033 | Tháng 11 nhuận |

Chu kỳ: trung bình 7 tháng nhuận / 19 năm (chu kỳ Meton).

### 3. Can Chi
Hệ thống 60 năm (60 = 10 Thiên Can × 12 Địa Chi).

**10 Thiên Can**: Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý

**12 Địa Chi**: Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi

```
Can  = (year - 4) mod 10
Chi  = (year - 4) mod 12
```

Can Chi áp dụng cho: **năm, tháng, ngày, giờ**.

### 4. Giờ Hoàng Đạo
Dựa trên 12 giờ địa chi (mỗi giờ = 2 tiếng dương lịch).

| Giờ | Thời Gian (DL) | 
|-----|----------------|
| Tý  | 23:00 – 01:00  |
| Sửu | 01:00 – 03:00  |
| Dần | 03:00 – 05:00  |
| ... | ...            |

Hoàng Đạo hay Hắc Đạo phụ thuộc vào **Chi của ngày âm lịch**.

---

## API — `lib/lunar.ts`

### Types

```typescript
interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
  dayName: string;   // Can Chi ngày: "Canh Thìn"
  monthName: string; // "Tháng Hai" hoặc "Tháng Hai (Nhuận)"
  yearName: string;  // "Bính Ngọ"
}

interface CanChi {
  year: string;   // "Bính Ngọ"
  month: string;  // "Quý Mão"
  day: string;    // "Canh Thìn"
  hour: string;   // "Đinh Tý" (giờ Tý)
}

interface HoangDaoHour {
  chi: string;         // "Tý"
  startHour: number;   // 23
  endHour: number;     // 1
  isHoangDao: boolean; // true = Hoàng Đạo, false = Hắc Đạo
}
```

### Functions

```typescript
// Chuyển đổi dương lịch → âm lịch
function solarToLunar(year: number, month: number, day: number): LunarDate

// Chuyển đổi âm lịch → dương lịch
function lunarToSolar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeap: boolean
): Date

// Lấy Can Chi đầy đủ của một ngày dương lịch
function getCanChi(year: number, month: number, day: number, hour?: number): CanChi

// Lấy danh sách giờ Hoàng Đạo/Hắc Đạo trong ngày
function getHoangDao(lunarDay: number, lunarMonth: number): HoangDaoHour[]

// Kiểm tra năm âm lịch có nhuận không
function isLeapYear(lunarYear: number): boolean

// Lấy tháng nhuận của năm âm lịch (0 nếu không có)
function getLeapMonth(lunarYear: number): number

// Số ngày trong tháng âm lịch (29 hoặc 30)
function daysInLunarMonth(lunarYear: number, lunarMonth: number, isLeap: boolean): number
```

---

## Test Cases Quan Trọng

### Năm Nhuận
```
2023-03-21 (DL) → âm: 01/02/Quý Mão      ✓ (trước tháng 2 nhuận)
2023-03-22 (DL) → âm: 02/02/Quý Mão      ✓
2023-04-20 (DL) → âm: 01/02 Nhuận/Quý Mão ✓ (đầu tháng 2 nhuận)
2023-05-19 (DL) → âm: 30/02 Nhuận/Quý Mão ✓
2023-05-20 (DL) → âm: 01/03/Quý Mão      ✓ (sau tháng 2 nhuận)
```

### Chuyển Đổi Qua Năm
```
2025-12-31 (DL) → âm: 12/11/Ất Tỵ   ✓
2026-01-01 (DL) → âm: 13/11/Ất Tỵ   ✓
2026-01-29 (DL) → âm: 01/01/Bính Ngọ ✓ (Tết 2026)
```

### Can Chi Năm
```
2024 → Giáp Thìn  ✓
2025 → Ất Tỵ      ✓
2026 → Bính Ngọ   ✓
2033 → Quý Sửu    ✓ (năm nhuận tháng 11)
```

---

## WASM Build

File `lunar.wasm` được compile từ nguồn C/Rust:

```bash
# Build (nếu cần rebuild)
wasm-pack build --target web ./lunar-engine/

# Output
public/lunar.wasm
lib/lunar_bg.wasm.d.ts
```

### Loading Strategy

```typescript
// lib/lunar.ts
let wasmModule: LunarWasm | null = null;

export async function initLunar(): Promise<void> {
  if (wasmModule) return; // Chỉ load 1 lần
  const wasm = await import('/lunar.wasm');
  wasmModule = await wasm.default();
}
```

Sử dụng trong component:
```typescript
// Khởi tạo ở root layout hoặc provider
await initLunar();
```

---

## Xử Lý Edge Cases

| Trường hợp | Xử lý |
|---|---|
| Tháng nhuận — ngày không hợp lệ | Clamp về ngày cuối tháng |
| Năm < 1900 hoặc > 2100 | Throw `LunarRangeError` |
| Giờ âm lịch qua nửa đêm (Tý: 23h-1h) | Split xử lý theo 2 ngày DL |
| Múi giờ người dùng khác UTC+7 | Luôn tính theo UTC+7 (Việt Nam) |
