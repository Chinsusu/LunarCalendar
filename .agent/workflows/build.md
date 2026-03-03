---
description: build production bundle và phân tích bundle size
---

# Build Workflow — Lịch Âm Việt

Workflow này build production bundle và kiểm tra kích thước.

## Bước 1: Kiểm tra TypeScript

// turbo
```bash
npx tsc --noEmit
```

## Bước 2: Chạy Tests

// turbo
```bash
npm test -- --passWithNoTests
```

## Bước 3: Build Production

// turbo
```bash
npm run build
```

Kiểm tra output:
- Không có errors
- Không có critical warnings
- `.next/` folder được tạo

## Bước 4: Phân Tích Bundle Size (tùy chọn)

Chạy bundle analyzer để kiểm tra JS bundle < 200KB gzipped:

```bash
ANALYZE=true npm run build
```

Mở `http://localhost:8888` để xem bundle report.

## Bước 5: Test Production Build Locally (tùy chọn)

```bash
npm start
```

Mở [http://localhost:3000](http://localhost:3000) và kiểm tra:
- [ ] Trang chủ load đúng
- [ ] Ngày âm lịch hiển thị đúng
- [ ] PWA manifest load (DevTools → Application)
- [ ] Service Worker đăng ký thành công

## Kết Quả Mong Đợi

| Metric | Target |
|--------|--------|
| Build time | < 60s |
| JS Bundle (gzipped) | < 200KB |
| Không có TypeScript errors | ✓ |
| Không có test failures | ✓ |
