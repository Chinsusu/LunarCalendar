# Product Requirements Document (PRD)
# Lịch Âm Dương Việt Nam

**Version:** 1.0  
**Author:** DenDa Team  
**Date:** December 2024  
**Status:** Draft

---

## 1. Executive Summary

Ứng dụng Lịch Âm Dương Việt Nam là một cross-platform app (Web + Android) cung cấp thông tin lịch âm dương chính xác cho người Việt Nam, hỗ trợ offline hoàn toàn với dữ liệu từ năm 1900-2100.

### 1.1 Vision Statement
> "Mang truyền thống văn hóa Việt Nam vào thời đại số - một công cụ lịch âm dương chính xác, tiện lợi và offline-first."

### 1.2 Target Platforms
| Platform | Priority | Technology |
|----------|----------|------------|
| Web | P0 (First) | React Native Web |
| Android | P1 (Second) | React Native (Expo) |
| iOS | P2 (Future) | React Native (Expo) |

---

## 2. Problem Statement

### 2.1 User Pain Points
1. **Thiếu nguồn đáng tin cậy:** Nhiều app lịch âm có sai số về Can Chi, giờ hoàng đạo
2. **Phụ thuộc internet:** Hầu hết app cần online để tra cứu
3. **UX kém:** Giao diện phức tạp, khó sử dụng cho người lớn tuổi
4. **Thiếu tính năng:** Không có sunrise/sunset theo vị trí

### 2.2 Market Opportunity
- 100M+ người Việt có nhu cầu tra cứu lịch âm
- Các dịp lễ tết, cưới hỏi, xây nhà đều cần xem ngày
- Gap trong thị trường cho app chất lượng cao, offline-first

---

## 3. Goals & Success Metrics

### 3.1 Business Goals
| Goal | Metric | Target |
|------|--------|--------|
| User Acquisition | MAU | 100K trong 6 tháng |
| Engagement | Daily Opens | 3+ lần/user/ngày |
| Retention | D30 | >40% |
| App Rating | Store Rating | ≥4.5 stars |

### 3.2 Technical Goals
| Goal | Metric | Target |
|------|--------|--------|
| Offline First | Offline Capability | 100% core features |
| Performance | First Load | <2s Web, <1s Android |
| Accuracy | Calendar Calculation | 100% match with Vietnam Academy |
| Bundle Size | App Size | <10MB Android |

---

## 4. User Personas

### 4.1 Persona 1: Bà Lan (65 tuổi)
- **Background:** Người nội trợ, ít sử dụng công nghệ
- **Needs:** Xem ngày tốt để cúng giỗ, xem giờ hoàng đạo
- **Pain Points:** Giao diện phức tạp, chữ nhỏ
- **Requirements:** Font lớn, UI đơn giản, màu sắc dễ nhìn

### 4.2 Persona 2: Anh Minh (35 tuổi)
- **Background:** Nhân viên văn phòng, đám cưới sắp tới
- **Needs:** Chọn ngày cưới, xem tuổi hợp
- **Pain Points:** Không biết cách tính Can Chi
- **Requirements:** Giải thích chi tiết, gợi ý ngày tốt

### 4.3 Persona 3: Chị Hà (28 tuổi)
- **Background:** Kinh doanh online
- **Needs:** Xem ngày khai trương, xuất hành
- **Pain Points:** Cần tra nhanh, không có thời gian
- **Requirements:** Widget, notification, quick view

---

## 5. Feature Requirements

### 5.1 Core Features (MVP - P0)

#### F1: Lịch Âm Dương Cơ Bản
| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| F1.1 | Calendar View | Hiển thị tháng với ngày dương + âm | P0 |
| F1.2 | Day Detail | Chi tiết ngày: Can Chi năm/tháng/ngày | P0 |
| F1.3 | Date Range | Hỗ trợ 1900-2100 (200 năm) | P0 |
| F1.4 | Leap Month | Xử lý tháng nhuận chính xác | P0 |

#### F2: Can Chi & Ngũ Hành
| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| F2.1 | Year Stem-Branch | Can Chi năm (Giáp Tý, Ất Sửu...) | P0 |
| F2.2 | Month Stem-Branch | Can Chi tháng | P0 |
| F2.3 | Day Stem-Branch | Can Chi ngày | P0 |
| F2.4 | Hour Stem-Branch | Can Chi 12 canh giờ | P0 |
| F2.5 | Five Elements | Ngũ hành tương ứng | P0 |

#### F3: Hoàng Đạo - Hắc Đạo
| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| F3.1 | Day Type | Xác định ngày hoàng/hắc đạo | P0 |
| F3.2 | Good Hours | 6 giờ hoàng đạo trong ngày | P0 |
| F3.3 | Bad Hours | 6 giờ hắc đạo trong ngày | P0 |
| F3.4 | Hour Detail | Ý nghĩa từng giờ (Thanh Long, Minh Đường...) | P0 |

#### F4: Tiết Khí (24 Solar Terms)
| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| F4.1 | Solar Terms List | 24 tiết khí trong năm | P0 |
| F4.2 | Current Term | Tiết khí hiện tại | P0 |
| F4.3 | Term Dates | Ngày bắt đầu mỗi tiết | P0 |

#### F5: Sunrise/Sunset
| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| F5.1 | Default Location | Hanoi mặc định | P0 |
| F5.2 | Custom Location | Nhập tọa độ/chọn tỉnh thành | P1 |
| F5.3 | Twilight | Hoàng hôn, bình minh dân dụng | P1 |

### 5.2 Enhanced Features (P1)

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| E1 | Search Date | Tìm ngày theo tiêu chí | P1 |
| E2 | Date Converter | Chuyển đổi âm ↔ dương | P1 |
| E3 | Bookmarks | Lưu ngày quan trọng | P1 |
| E4 | Notifications | Nhắc ngày lễ, giỗ | P1 |
| E5 | Widget | Home screen widget | P1 |
| E6 | Dark Mode | Chế độ tối | P1 |

### 5.3 Future Features (P2)

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| P1 | Age Compatibility | Xem tuổi hợp | P2 |
| P2 | Feng Shui | Hướng xuất hành tốt | P2 |
| P3 | Vietnamese Holidays | Lịch lễ VN | P2 |
| P4 | Sync | Cloud sync bookmarks | P2 |

---

## 6. User Stories

### Epic 1: Xem Lịch
```
US-1.1: Là người dùng, tôi muốn xem lịch tháng hiện tại để biết ngày âm dương
  Acceptance Criteria:
  - Hiển thị grid 7x5/6 ô cho tháng
  - Mỗi ô hiển thị ngày dương (lớn) + ngày âm (nhỏ)
  - Highlight ngày hôm nay
  - Swipe để chuyển tháng

US-1.2: Là người dùng, tôi muốn xem chi tiết một ngày để biết Can Chi và giờ tốt
  Acceptance Criteria:
  - Tap vào ngày để mở detail view
  - Hiển thị: Can Chi năm/tháng/ngày
  - Hiển thị: 12 canh giờ với màu hoàng/hắc đạo
  - Hiển thị: Tiết khí (nếu có)
```

### Epic 2: Tra Cứu
```
US-2.1: Là người dùng, tôi muốn chuyển đổi ngày âm sang dương
  Acceptance Criteria:
  - Input: ngày/tháng/năm âm lịch
  - Output: ngày/tháng/năm dương lịch tương ứng
  - Xử lý tháng nhuận

US-2.2: Là người dùng, tôi muốn tìm ngày hoàng đạo trong tháng
  Acceptance Criteria:
  - Hiển thị danh sách ngày hoàng đạo
  - Filter theo loại việc (cưới, khai trương...)
```

---

## 7. Non-Functional Requirements

### 7.1 Performance
| Metric | Web | Android |
|--------|-----|---------|
| First Contentful Paint | <1.5s | <1s |
| Time to Interactive | <3s | <2s |
| Bundle Size | <500KB gzip | <10MB APK |
| Memory Usage | <50MB | <100MB |

### 7.2 Offline Capability
- 100% core calculations offline
- Pre-computed data for 1900-2100
- No network required for any P0 feature

### 7.3 Accessibility
- Font size: 16px minimum, scalable
- Color contrast: WCAG AA
- Screen reader support
- Touch target: 44x44px minimum

### 7.4 Localization
- Primary: Vietnamese
- Secondary: English (P2)
- RTL: Not required

---

## 8. Technical Constraints

### 8.1 Platform Constraints
- **Expo SDK:** 51+ (Latest stable)
- **React Native:** 0.74+
- **Node.js:** 18+ LTS
- **Android:** API 24+ (Android 7.0+)
- **Web:** ES2020+ browsers

### 8.2 Data Constraints
- Lunar calendar data: Pre-computed lookup tables
- Sunrise/Sunset: SunCalc algorithm (no API)
- All calculations: Client-side only

---

## 9. Release Plan

### Phase 1: MVP Web (Week 1-4)
- [ ] Core calendar logic
- [ ] Web UI with basic features
- [ ] Testing & QA

### Phase 2: MVP Android (Week 5-6)
- [ ] Android build configuration
- [ ] Native optimizations
- [ ] Play Store submission

### Phase 3: Enhancement (Week 7-10)
- [ ] P1 features
- [ ] Performance optimization
- [ ] User feedback integration

---

## 10. Appendix

### A. Glossary
| Term | Vietnamese | Description |
|------|------------|-------------|
| Lunar Calendar | Âm lịch | Calendar based on moon phases |
| Solar Calendar | Dương lịch | Gregorian calendar |
| Stem-Branch | Can Chi | 60-year cycle (10 stems × 12 branches) |
| Heavenly Stems | Thiên Can | 10 elements: Giáp, Ất, Bính... |
| Earthly Branches | Địa Chi | 12 animals: Tý, Sửu, Dần... |
| Hoang Dao | Hoàng Đạo | Auspicious day/hour |
| Hac Dao | Hắc Đạo | Inauspicious day/hour |
| Solar Terms | Tiết Khí | 24 divisions of solar year |

### B. References
- Vietnam Academy of Science and Technology lunar data
- "Lịch Vạn Niên" traditional calculation methods
- SunCalc astronomical algorithms
