---
description: cập nhật changelog, tạo version tag, commit và push lên GitHub
---

# Release Workflow — Lịch Âm Việt

Workflow này thực hiện full release cycle: changelog → version tag → commit → push.

> **⚠️ Lưu ý**: Nếu `git commit` bị treo (không có output trong terminal), nguyên nhân là git cố mở editor hoặc yêu cầu GPG signing. Chạy một lần:
> ```bash
> git config commit.gpgsign false
> git config core.editor "true"
> ```
> Sau đó kiểm tra lại bằng `git log --oneline -1` — nếu commit xuất hiện thì lệnh trước đã thành công dù bị treo.

## Chuẩn Bị

Trước khi chạy release, xác nhận:
- [ ] Tất cả changes đã được merge vào `main`
- [ ] Tests pass: `npm test`
- [ ] Build thành công: `npm run build`
- [ ] `CHANGELOG.md` có section `[Unreleased]` với nội dung cần release

## Bước 1: Xác Định Version Mới

Quy tắc [Semantic Versioning](https://semver.org/):
- `MAJOR` (X.0.0): Breaking changes
- `MINOR` (0.X.0): Tính năng mới, backward-compatible
- `PATCH` (0.0.X): Bug fixes

Ví dụ: version hiện tại `0.1.0` → release `0.2.0` khi có tính năng mới.

## Bước 2: Cập Nhật CHANGELOG.md

Mở `CHANGELOG.md` và:
1. Đổi `## [Unreleased]` thành `## [VERSION] — YYYY-MM-DD`
2. Thêm section `## [Unreleased]` mới (trống) ở trên cùng
3. Cập nhật link compare ở cuối file

Ví dụ:
```markdown
## [Unreleased]

---

## [0.2.0] — 2026-03-15

### Added
- LunarDatePicker iOS-style drum roll
- MonthCalendar lưới tháng
...
```

## Bước 3: Commit Changelog

// turbo
```bash
git add CHANGELOG.md
git commit -m "chore(release): update CHANGELOG for v$(node -p "require('./package.json').version")"
```

## Bước 4: Cập Nhật Version trong package.json

Dùng npm version để tự động cập nhật `package.json` (KHÔNG tạo git tag):

```bash
# Chọn đúng loại:
npm version patch --no-git-tag-version   # 0.1.0 → 0.1.1
npm version minor --no-git-tag-version   # 0.1.0 → 0.2.0
npm version major --no-git-tag-version   # 0.1.0 → 1.0.0
```

## Bước 5: Commit Version Bump

// turbo
```bash
VERSION=$(node -p "require('./package.json').version")
git add package.json package-lock.json
git commit -m "chore(release): bump version to v$VERSION"
```

## Bước 6: Tạo Git Tag

// turbo
```bash
VERSION=$(node -p "require('./package.json').version")
git tag -a "v$VERSION" -m "Release v$VERSION"
```

## Bước 7: Push Commits và Tag

// turbo
```bash
git push origin main
git push origin --tags
```

## Bước 8: Xác Nhận

Kiểm tra trên GitHub:
- [ ] Commits mới xuất hiện trên `main`
- [ ] Tag mới hiển thị trong **Releases** → **Tags**
- [ ] Tạo GitHub Release từ tag (thủ công, paste nội dung từ CHANGELOG)

## Ví Dụ Full Release (v0.2.0)

```bash
# 1. Kiểm tra trạng thái
git status
git log --oneline -5

# 2. Cập nhật CHANGELOG.md (thủ công)
# ... edit CHANGELOG.md ...

# 3. Bump version
npm version minor --no-git-tag-version

# 4. Commit
git add CHANGELOG.md package.json package-lock.json
git commit -m "chore(release): release v0.2.0"

# 5. Tag
git tag -a "v0.2.0" -m "Release v0.2.0"

# 6. Push
git push origin main --tags
```
