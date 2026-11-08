# Kế Hoạch Triển Khai Giao Diện Landing Page SCMS (Quiet Luxury Editorial Style)

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng giao diện Landing Page đẳng cấp cho hệ sinh thái SCMS (Sports Center Management System) bằng React + TypeScript, mô phỏng chuẩn xác phong cách tạp chí kiến trúc/nội thất cao cấp từ mẫu tham khảo (Quiet Luxury / Warm Minimalist), tích hợp đầy đủ hiệu ứng chuyển slide, micro-interactions, thumbnail strip và kết nối với các phân hệ hiện có của dự án.

**Architecture:** Kiến trúc component theo chuẩn Feature-Sliced / Package-by-Feature tại `apps/web/src/features/landing`. Tách biệt thành các Atomic UI Components (Buttons, Marquee, Controls, Thumbnails) và 5 Màn hình Slide nội dung SCMS (Hero, About Philosophy, Disciplines Carousel, Contact & Footer). Hỗ trợ cả 2 chế độ: **Slide Deck View** (trình chiếu như mẫu) và **Editorial Scroll View**.

**Tech Stack:** React 19, TypeScript, React Router 7, Vanilla CSS với CSS Variables, Google Fonts (Cormorant Garamond, Playfair Display, Plus Jakarta Sans), hardware-accelerated CSS Animations (`cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 1. Thiết Kế Hệ Thống Chuyển Động (Animation & Interaction Specifications)

### 1.1. Chuyển Đổi Màn Hình / Slide Transitions
- **Hiệu ứng Trượt & Zoom Lớp (Layered Slide Transition):**
  - Khi chuyển từ Slide $N$ sang Slide $N+1$:
    - Slide hiện tại: Mờ dần (`opacity: 1 -> 0`) kết hợp co nhẹ (`transform: scale(1) -> scale(0.97)`), thời gian 450ms.
    - Slide kế tiếp: Trượt vào từ phía dưới (`transform: translateY(40px) scale(1.03) -> translateY(0) scale(1)`), `opacity: 0 -> 1`, thời gian 650ms `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Nội dung hiển thị so le (Staggered Content Entrance):**
  - Mọi slide khi kích hoạt sẽ cho các thành phần con xuất hiện tuần tự theo nhịp:
    - 0ms: Tag danh mục (Category Tracker)
    - 120ms: Tiêu đề nghệ thuật (Editorial Headline)
    - 240ms: Khối văn bản mô tả & thông số
    - 360ms: Cặp hình ảnh bất đối xứng (Fade-in + Scale)
    - 480ms: Nút hành động CTA / Link

### 1.2. Tương Tác Vi Mô (Micro-Interactions)
- **Nút Mũi Tên Động (`ArrowButton`):**
  - Trạng thái thường: Đường kẻ ngang dài 20px, mũi tên `→`.
  - Hover: Đường line nở dài thành 36px (`transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1)`), mũi tên trượt sang phải 4px.
  - Active/Click: Thu nhỏ nhẹ (`scale(0.96)`) tạo phản hồi xúc giác.
- **Nút Tròn Điều Hướng Carousel (`←` `→`):**
  - Hover: Nền chuyển dần từ trong suốt sang màu be cát ấm (`#EAE3D9`), icon nhích 2px theo chiều tương ứng.
  - Click: Hiệu ứng lan tỏa xung lực (ripple pulse wave).
- **Thẻ Ảnh Bất Đối Xứng (Asymmetric Image Cards):**
  - Khung ảnh có `overflow: hidden`.
  - Hover: Ảnh zoom nhẹ 4% (`transform: scale(1.04)` trong 800ms mượt mà), tăng độ sâu tương phản.
- **Ô Nhập Liệu Form (Minimal Underline Inputs):**
  - Đường line cơ sở màu xám nhạt (`rgba(0,0,0,0.15)`).
  - Khi `focus`: Một đường line màu nâu sẫm espresso nở từ giữa ra hai mép (`transform: scaleX(0) -> scaleX(1)` trong 300ms).
- **Dải Marquee Chạy Chữ Chuyển Động Vô Tận (Infinite Ticker):**
  - Chuyển động liên tục êm ái bằng `transform: translate3d(-50%, 0, 0)`.
  - Khi di chuột vào dải chữ (`:hover`): Giảm tốc độ từ từ (ease slow-down) để người dùng có thể đọc rõ thông điệp.
- **Thanh Thumbnail Danh Sách Slide (Right Thumbnail Strip):**
  - Thumbnail đang xem (Active): Có viền màu nâu be đậm, kèm thanh chỉ báo tiến độ đọc (reading progress line).
  - Hover các thumbnail khác: Nâng sáng nhẹ (`brightness(1.1)`), trượt nhẹ sang trái 4px.

---

## 2. Bản Đồ File & Trách Nhiệm Thành Phần

```
apps/web/
├── index.html                               # Import Google Fonts cao cấp (Cormorant Garamond, Plus Jakarta Sans)
├── src/
│   ├── styles.css                           # Global design tokens, animation keyframes, scrollbar styling
│   ├── app/
│   │   └── router.tsx                       # Cập nhật route '/' dẫn đến LandingPage mới
│   └── features/
│       └── landing/
│           ├── types.ts                     # Types & Interfaces (SlideData, DisciplineItem, InquiryForm)
│           ├── landing.css                  # CSS chuyên biệt cho Landing Page, animations, typography ligatures
│           ├── components/
│           │   ├── Navbar.tsx               # Header thanh lịch: Logo, Menu links, nút 'PORTAL LOGIN'
│           │   ├── ArrowButton.tsx          # Link nút mũi tên co dãn khi hover
│           │   ├── SlideControls.tsx        # Cụm mũi tên tròn điều hướng carousel
│           │   ├── ThumbnailStrip.tsx       # Thanh danh sách slide bên phải màn hình
│           │   ├── InfiniteMarquee.tsx      # Dải chữ watermark chạy vô tận
│           │   └── slides/
│           │       ├── HeroSlide.tsx        # Slide 1: "DISCIPLINE. MOVEMENT. MASTERY."
│           │       ├── AboutSlide.tsx       # Slide 2: "TRAIN WITH INTENTION" + 2 ảnh bất đối xứng
│           │       ├── DisciplinesSlide.tsx # Slide 3 & 4: Showcase bộ môn (Pilates/Yoga & Strength/Boxing)
│           │       ├── ContactSlide.tsx     # Slide 5: Form đăng ký tư vấn + Footer 4 cột SCMS
│           │       └── ViewModeToggle.tsx   # Nút chuyển đổi giữa 'Deck Presentation' và 'Full Scroll'
│           ├── hooks/
│           │   └── useSlideController.ts    # Quản lý trạng thái slide, phím tắt, wheel debounce, touch swipe
│           ├── assets/
│           │   └── images.ts                # Bộ sưu tập ảnh chất lượng cao chuyên đề thể thao & kiến trúc wellness
│           └── LandingPage.tsx              # Component trang chủ tổng hợp
```

---

## 3. Các Bước Thực Hiện Chi Tiết (Bite-Sized Tasks)

### Task 1: Thiết lập Typography & Design System Tokens
- [ ] Thêm liên kết Google Fonts (*Cormorant Garamond*, *Playfair Display*, *Plus Jakarta Sans*) vào `apps/web/index.html`.
- [ ] Cập nhật CSS variables (Bảng màu Quiet Luxury: Warm Alabaster, Espresso Bronze, Soft Sandstone, Sage Tint) và các class tiện ích trong `apps/web/src/styles.css`.
- [ ] Định nghĩa các animation keyframes: `fadeSlideInUp`, `fadeSlideOutDown`, `marqueeScroll`, `scalePulse`, `underlineExpand`.

### Task 2: Xây Dựng Asset Data & Types
- [ ] Tạo file `apps/web/src/features/landing/types.ts` chứa cấu trúc dữ liệu cho Slide, Disciplines, Inquiry form.
- [ ] Tạo file `apps/web/src/features/landing/assets/images.ts` chứa các hình ảnh không gian thể thao, studio Pilates, sàn boxing, recovery lounge chuẩn thẩm mỹ cao.

### Task 3: Xây Dựng Atomic Interactive Components
- [ ] Tạo `ArrowButton.tsx`: Nút liên kết với hiệu ứng kéo dài đường line và trượt mũi tên khi hover.
- [ ] Tạo `SlideControls.tsx`: Nút tròn điều hướng trước/sau với phản hồi màu nền và hiệu ứng nhích nhẹ.
- [ ] Tạo `InfiniteMarquee.tsx`: Dải chữ chạy ngang liên tục hardware-accelerated với hiệu ứng giảm tốc khi hover.
- [ ] Tạo `Navbar.tsx`: Thanh điều hướng trong suốt tinh xảo với logo AURA ATHLETICS, menu và nút truy cập Portal SCMS (`/login`).

### Task 4: Triển Khai 5 Màn Hình Slide Nội Dung SCMS
- [ ] **Slide 1 (`HeroSlide.tsx`)**:
  - Tiêu đề nghệ thuật chữ hoa: *"DISCIPLINE. MOVEMENT. MASTERY."* với chữ *MOVEMENT* in nghiêng uốn lượn phong cách editorial.
  - Background kiến trúc câu lạc bộ thể thao ánh sáng ấm, watermark chìm `AURA ATHLETICS`.
  - Nút kêu gọi hành động: `EXPLORE MEMBERSHIP ─→` dẫn tới slide đăng ký.
- [ ] **Slide 2 (`AboutSlide.tsx`)**:
  - Nhãn `ABOUT US / TRIẾT LÝ VẬN HÀNH`.
  - Tiêu đề: *"TRAIN WITH INTENTION"*.
  - Nội dung triết lý kết nối thể chất, hơi thở và công nghệ AI Coaching theo tài liệu `PROJECT_MASTER_GUIDE.md`.
  - Khung ảnh bất đối xứng: 1 ảnh dọc lớn studio Pilates và 1 ảnh nhỏ góc xông hơi đá muối/phục hồi.
- [ ] **Slide 3 & 4 (`DisciplinesSlide.tsx`)**:
  - Nhãn `DISCIPLINES / CÁC BỘ MÔN`.
  - Bộ hiển thị carousel cho 2 bộ môn tiêu biểu:
    - *01/06 — ZENITH PILATES & YOGA SANCTUARY* (Studio 01, Lớp thảm & Reformer, Sức chứa 12 học viên, Hàng chờ thông minh).
    - *02/06 — OLYMPUS FUNCTIONAL & BOXING* (Studio 02, Tạ Olympic, Boxing ring, HLV 1-1 & AI InBody).
  - Tích hợp cụm mũi tên `←` `→` chuyển đổi mượt mà giữa các bộ môn kèm thông tin bảng màu và mô tả chi tiết.
- [ ] **Slide 5 (`ContactSlide.tsx`)**:
  - Tiêu đề: *"BEGIN YOUR TRANSFORMATION"*.
  - Form tư vấn hội viên với các trường nhập liệu tối giản: Họ tên, Số điện thoại, Email, Gói mong muốn, Lời nhắn.
  - Nút gửi yêu cầu `REQUEST CONSULTATION ─→` với thông báo thành công đẹp mắt.
  - **Footer SCMS đồng bộ**:
    - Logo thương hiệu + Tóm tắt trung tâm.
    - Cột điều hướng nội dung.
    - Cột liên kết Cổng đăng nhập (`/login`) cho Hội viên, Lễ tân, HLV, Quản lý.
    - Dải Marquee chạy chữ typographic: `✦ ELEVATE YOUR STRENGTH ✦ EMBRACE MINDFULNESS ✦ JOIN THE CLUB ✦`.

### Task 5: Xây Dựng Slide Controller & Thumbnail Strip
- [ ] Xây dựng hook `useSlideController.ts` xử lý:
  - Phím mũi tên lên/xuống/trái/phải, phím Space, PageUp, PageDown.
  - Thao tác cuộn chuột có debounce chống nhảy slide đột ngột.
  - Thao tác vuốt ngón tay (Touch swipe) trên thiết bị di động / trackpad.
- [ ] Tạo component `ThumbnailStrip.tsx` mô phỏng dải thumbnail bên phải màn hình:
  - Preview thu nhỏ từng slide.
  - Chỉ số slide hiện tại (ví dụ: `01 / 05`).
  - Nút mũi tên lên/xuống di chuyển slide nhanh.

### Task 6: Tích Hợp Vào Routing & Hoàn Thiện Trải Nghiệm
- [ ] Tạo `LandingPage.tsx` bọc toàn bộ thành phần, hỗ trợ nút bấm chuyển đổi giữa chế độ **Presentation View** (như mẫu của bạn) và **Full Scroll View**.
- [ ] Cập nhật `apps/web/src/app/router.tsx` để hiển thị `LandingPage` tại route gốc `/`, đảm bảo các route `/login` và bảo vệ tài khoản người dùng vẫn hoạt động hoàn hảo.
- [ ] Kiểm tra hiển thị responsive (Desktop, Tablet, Mobile).
- [ ] Chạy linter và build test (`npm run build`) để đảm bảo không có lỗi TypeScript hay cú pháp.
