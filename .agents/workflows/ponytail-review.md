---
name: ponytail-review
description: Review pull request hoặc git diff theo tiêu chuẩn Senior Dev - đánh giá độ tinh gọn, rà soát bloat, và tối ưu hóa diff
---

# Workflow: Ponytail Review

Thực hiện code review dựa trên tiêu chí tối giản, tinh gọn và an toàn.

## Bộ câu hỏi kiểm tra Review
1. **Diff này có dài hơn mức cần thiết không?** Có thể đạt cùng kết quả với ít dòng hơn không?
2. **Có thêm dependency nào mới không?** Liệu có thể dùng thư viện có sẵn không?
3. **Có thêm boilerplate hoặc abstraction dự phòng nào không?**
4. **Sửa lỗi đã triệt để ở root cause chưa?** Có bỏ sót caller nào khác của hàm dùng chung không?
5. **Độ an toàn:** Không cắt giảm input validation ở trust boundaries, không bỏ qua transaction rollback hoặc error handling bảo vệ dữ liệu.
6. **Đa ngôn ngữ & Bất biến:** Đảm bảo không hard-code chuỗi (tuân thủ i18n), giữ vững trigger constraints.
