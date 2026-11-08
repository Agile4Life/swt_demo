# Bổ sung thiết kế: PostgreSQL làm database deploy

Phạm vi database của thiết kế backend layered tại `2026-10-01-backend-layered-jpa-design.md` được cập nhật như sau:

- PostgreSQL là database triển khai mục tiêu đã được người dùng xác nhận.
- SQL Server hiện tại tiếp tục được hỗ trợ trong giai đoạn chuyển đổi.
- Cấu hình PostgreSQL gồm driver và Spring profile tách biệt; thông tin kết nối lấy từ environment, không hard-code.
- Có migration riêng cho PostgreSQL. Các migration SQL Server giữ riêng khi schema/trigger/computed column phụ thuộc vendor.
- PostgreSQL phải được kiểm chứng bằng integration test trên PostgreSQL thật trước khi tuyên bố sẵn sàng deploy. H2 có thể dùng cho kiểm thử nhanh, không thay thế kiểm chứng PostgreSQL.
- Business layer và repository query ưu tiên JPA/JPQL chuẩn; lỗi constraint hoặc SQL đặc thù được cô lập sau adapter theo database provider.
- Không đổi schema nghiệp vụ hoặc bỏ các bất biến trigger hiện có khi chưa có migration tương đương và kiểm thử trên cả engine liên quan.
