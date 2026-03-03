# Checklist Trước Khi Deploy — Lịch Âm Việt

Hoàn thành tất cả mục dưới đây trước khi deploy lên production.

---

## 1. 🌙 Lunar Engine Validation

### Chuyển Đổi Cơ Bản
- [ ] 1000+ test cases pass — so sánh với lịch in uy tín Việt Nam
- [ ] Kiểm tra toàn bộ năm 2025, 2026 (365 ngày × 2)
- [ ] Test chuyển đổi ngược: `lunarToSolar(solarToLunar(d)) === d`

### Năm Nhuận
- [ ] 2023 (nhuận tháng 2) — verified
- [ ] 2025 (nhuận tháng 6) — verified
- [ ] 2033 (nhuận tháng 11) — verified
- [ ] Ngày đầu/cuối tháng nhuận chuyển đúng
- [ ] Tháng ngay sau tháng nhuận chuyển đúng

### Can Chi
- [ ] Can Chi năm — test 2020–2033 (14 năm)
- [ ] Can Chi tháng — test 12 tháng × 3 năm
- [ ] Can Chi ngày — test 365 ngày × 4 năm
- [ ] Can Chi giờ — test 12 giờ × 5 ngày

### Giờ Hoàng Đạo
- [ ] 12 Chi pattern đúng với tài liệu tham chiếu
- [ ] Giờ Tý (23h–1h) xử lý qua nửa đêm đúng
- [ ] Verify với Lịch Vạn Niên in ít nhất 30 ngày khác nhau

---

## 2. 🎨 UI/UX Checklist (theo UI UX Pro Max)

### Component Quality
- [ ] Không dùng emoji làm icon — tất cả dùng Lucide SVG
- [ ] Tất cả clickable elements có `cursor-pointer`
- [ ] Hover states có transition 150–300ms
- [ ] Loading states cho WASM initialization (~1s)
- [ ] Empty states có UI rõ ràng (không có sự kiện, ghi chú)

### Accessibility (WCAG AA)
- [ ] Text contrast ≥ 4.5:1 — dùng [WebAIM Checker](https://webaim.org/resources/contrastchecker/)
  - [ ] Primary text `#2C1810` trên `#F5ECD7` — pass
  - [ ] Primary red `#8B1A1A` trên `#FAF3E4` — pass
  - [ ] Muted text `#8B7355` trên `#F5ECD7` — check
- [ ] Focus states visible cho keyboard navigation
- [ ] `aria-label` cho tất cả icon-only buttons
- [ ] `lang="vi"` trên thẻ `<html>`
- [ ] `prefers-reduced-motion` được respect

### Responsive
- [ ] 375px (iPhone SE) — layout không bị vỡ
- [ ] 768px (iPad) — layout đẹp
- [ ] 1024px — layout đẹp
- [ ] 1280px (Desktop) — layout đẹp

---

## 3. 📱 PWA Checklist

### Manifest
- [ ] `manifest.json` đầy đủ: `name`, `short_name`, `icons`, `theme_color`, `background_color`
- [ ] Icons: 192×192, 512×512, maskable variant
- [ ] `theme_color: #8B1A1A` (sơn mài đỏ trầm)
- [ ] `background_color: #F5ECD7` (giấy dó)

### Service Worker
- [ ] Offline fallback page hoạt động
- [ ] Asset caching (JS, CSS, WASM, fonts, icons)
- [ ] WASM được cache — kiểm tra DevTools > Network (offline mode)
- [ ] App hoạt động hoàn toàn khi mất mạng

### Install & Push
- [ ] Install prompt (`beforeinstallprompt`) được handle
- [ ] HTTPS enabled (bắt buộc cho PWA + Web Push)
- [ ] Notification permission request UX friendly (không hỏi ngay khi mở app)
- [ ] iOS Safari < 16: graceful degradation (fallback in-app reminder)

---

## 4. ⚡ Performance

Chạy Lighthouse trên Chrome DevTools (Incognito mode, throttled):

| Metric | Target | Actual | Pass? |
|--------|--------|--------|-------|
| Lighthouse Performance | > 85 | | |
| Lighthouse Accessibility | > 90 | | |
| First Contentful Paint | < 1.5s | | |
| Time to Interactive | < 3.0s | | |
| WASM Load (cold) | < 1.0s | | |
| WASM Load (cached) | < 100ms | | |
| JS Bundle (gzipped) | < 200KB | | |

```bash
# Phân tích bundle size
npm run build:analyze
```

---

## 5. 🌐 Cross-Browser Test

Test trên các trình duyệt thực tế, không chỉ DevTools emulation:

| Browser | Version | Lịch Ngày | Lịch Tháng | DatePicker | PWA Install |
|---------|---------|-----------|------------|-----------|-------------|
| Chrome | Latest | | | | |
| Safari | Latest | | | | |
| Firefox | Latest | | | | |
| Chrome Android | Latest | | | | |
| Safari iOS | Latest | | | | |

---

## 6. 📊 Final Sign-off

- [ ] Code review hoàn tất
- [ ] Không có `console.error` trong production build
- [ ] Không có TypeScript errors (`npm run type-check`)
- [ ] `npm run build` thành công không có warnings
- [ ] CHANGELOG.md cập nhật cho version mới
- [ ] Environment variables production được set
