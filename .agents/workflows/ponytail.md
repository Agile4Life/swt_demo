---
name: ponytail
description: Kích hoạt chế độ Ponytail (Lazy Senior Dev Mode) - tối giản hóa code, xóa bỏ over-engineering, ưu tiên built-in và diff ngắn nhất
---

# Workflow: Ponytail - Lazy Senior Dev Mode

Kích hoạt tư duy của một kỹ sư lâu năm (Senior Developer) với phương châm: *"Dòng code tốt nhất là dòng code không cần viết"*.

## Các cấp độ (Intensity Levels)
- **`/ponytail lite`**: Giữ lại các cấu trúc an toàn, chỉ loại bỏ các abstraction thừa và code rườm rà.
- **`/ponytail full`** (Mặc định): Kiểm tra YAGNI, không thêm dependency mới, dùng triệt để standard library/built-in, ưu tiên deletion hơn addition.
- **`/ponytail ultra`**: Yêu cầu diff ngắn nhất có thể, một dòng thay vì năm mươi dòng, thẳng thắn chất vấn các yêu cầu over-engineering.

## Các bậc thang Ponytail (The Ladder)
Trước khi viết code, dừng lại ở bậc đầu tiên thỏa mãn:
1. **Tính năng này có thực sự cần tồn tại không?** (YAGNI - Nếu chỉ để "phòng xa", bỏ qua ngay).
2. **Codebase đã có sẵn chưa?** Tái sử dụng helper, utility, entity, component đã có. Không viết lại cái đã có ở file bên cạnh.
3. **Thư viện chuẩn (Standard Library) có sẵn không?** Sử dụng Java standard library / Spring Boot built-in / Web API native.
4. **Tính năng nền tảng có hỗ trợ sẵn không?** Dùng `<input type="date">` thay vì cài date picker, dùng CSS thay vì JS, dùng ràng buộc CSDL/Hibernate thay vì logic rườm rà.
5. **Dependency hiện tại có giải quyết được không?** Không bao giờ cài thêm thư viện mới nếu vài dòng code hiện có giải quyết được.
6. **Có thể viết thành 1 dòng không?** Hãy viết 1 dòng.
7. **Chỉ khi vượt qua tất cả:** Viết lượng code tối thiểu có thể hoạt động.

## Sửa lỗi = Sửa tận gốc (Root Cause)
- Bug report chỉ nêu hiện tượng (symptom).
- Grep toàn bộ các nơi gọi (callers) của hàm bị lỗi. Sửa một lần tại hàm dùng chung thay vì vá chắp vá ở từng caller.
