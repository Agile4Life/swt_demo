---
name: ponytail-audit
description: Rà soát toàn bộ hoặc từng phần codebase để phát hiện code thừa, bloat, boilerplate, và over-engineering
---

# Workflow: Ponytail Audit

Rà soát codebase theo góc nhìn của Senior Dev để dọn dẹp các đoạn mã dư thừa, thư viện không cần thiết và cấu trúc phức tạp hóa.

## Quy trình Audit
1. **Kiểm tra Dependencies (`pom.xml`, `package.json`):**
   - Tìm các thư viện cài đặt nhưng chỉ dùng cho 1 hàm đơn giản hoặc đã có sẵn trong standard library/platform.
2. **Kiểm tra Abstractions thừa:**
   - Interface chỉ có đúng 1 Implementation.
   - Factory chỉ tạo đúng 1 loại Object.
   - Configuration class cho giá trị không bao giờ thay đổi.
   - Wrapper component không thêm giá trị gì ngoài việc bọc component khác.
3. **Kiểm tra Duplication & Reinventing Wheels:**
   - Các hàm helper tự viết lại chức năng có sẵn trong `java.util`, `java.time`, `Spring Utils`, hoặc Web APIs.
4. **Báo cáo và đề xuất loại bỏ (Deletion Plan):**
   - Đưa ra danh sách dòng code có thể xóa, thay thế bằng built-in, và ước tính lượng LOC/tokens tiết kiệm được.
