# Hướng Dẫn Đóng Góp

Cảm ơn bạn đã quan tâm đến **Lịch Âm Việt**! Tài liệu này hướng dẫn quy trình đóng góp cho dự án.

---

## 🚦 Quy Trình Làm Việc

1. **Fork** repository về tài khoản của bạn
2. **Tạo branch** từ `main`:
   ```bash
   git checkout -b feat/ten-tinh-nang
   # hoặc
   git checkout -b fix/mo-ta-bug
   ```
3. **Commit** theo convention (xem bên dưới)
4. **Push** và tạo **Pull Request** vào `main`
5. Đợi **code review** và phản hồi

---

## 📝 Commit Convention

Sử dụng [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <mô tả ngắn>
```

### Types

| Type | Khi nào dùng |
|---|---|
| `feat` | Thêm tính năng mới |
| `fix` | Sửa bug |
| `docs` | Cập nhật tài liệu |
| `style` | Thay đổi CSS/styling (không ảnh hưởng logic) |
| `refactor` | Refactor code (không thêm tính năng, không fix bug) |
| `test` | Thêm/sửa test |
| `chore` | Cập nhật config, build scripts |
| `perf` | Cải thiện performance |

### Ví Dụ

```
feat(lunar): thêm tính toán giờ Hoàng Đạo
fix(DayHero): sửa animation slide khi đổi ngày nhanh
docs(readme): cập nhật hướng dẫn cài đặt
test(lunar): thêm 500 test cases năm nhuận 2025
```

---

## ✅ Definition of Done

Mỗi PR cần đáp ứng **tất cả** tiêu chí sau trước khi merge:

- [ ] Code review pass (self-review checklist hoặc peer review)
- [ ] Unit test coverage > 80% cho business logic
- [ ] Responsive test: 375px, 768px, 1280px
- [ ] Lighthouse Performance > 85, Accessibility > 90
- [ ] Cross-browser test: Chrome, Safari, Firefox
- [ ] Không có `console.error` hay TypeScript errors
- [ ] WCAG AA contrast (4.5:1 tối thiểu)

---

## 🏗 Cấu Trúc Branch

| Branch | Mục Đích |
|---|---|
| `main` | Production-ready code |
| `develop` | Integration branch (nếu dùng Gitflow) |
| `feat/*` | Tính năng mới |
| `fix/*` | Bug fixes |
| `docs/*` | Cập nhật tài liệu |

---

## 🎨 Coding Standards

### TypeScript
- Dùng `strict` mode — không dùng `any`
- Interface > Type alias cho object shapes
- Named exports (không dùng default export cho components)

### React / Next.js
- Components đặt trong `components/` theo PascalCase
- File names: kebab-case (`day-hero.tsx`)
- Sử dụng Server Components khi có thể; Client Components khi cần state/effect

### CSS / Tailwind
- Chỉ dùng màu từ design system (không hardcode `#FF0000`)
- Không dùng emoji làm icon — dùng Lucide React
- Border radius: `8px` (`rounded`) — không dùng `rounded-full` cho button
- Transition: 150–300ms cho hover states

### Naming Convention
```
Components:  PascalCase          DayHero, LunarDatePicker
Files:       kebab-case          day-hero.tsx, lunar-date-picker.tsx
CSS vars:    --color-*, --font-* --color-primary, --font-display
Functions:   camelCase           getLunarDate(), formatCanChi()
Constants:   UPPER_SNAKE_CASE    MAX_YEAR_RANGE
```

---

## 🧪 Chạy Tests

```bash
# Unit tests
npm test

# Tests với coverage
npm run test:coverage

# Lunar algorithm test suite (1000+ cases)
npm run test:lunar
```

---

## 📦 Cài Đặt Môi Trường Dev

```bash
# Yêu cầu
node >= 18.17
npm >= 9

# Cài đặt
npm install

# Chạy dev server
npm run dev

# Build + analyze bundle
npm run build:analyze
```

---

## ❓ Câu Hỏi

Nếu có thắc mắc, vui lòng tạo Issue trên GitHub hoặc liên hệ qua nội bộ team.
