# Thiết kế refactor kiến trúc backend SCMS

## Mục tiêu

Chuẩn hóa backend Java hiện có theo mô hình ba lớp Spring Boot, áp dụng SOLID trong ranh giới phù hợp, dùng Spring Data JPA cho persistence, và tổ chức theo nghiệp vụ để thành viên có thể phát triển độc lập. Mỗi phần refactor sẽ có phạm vi nhỏ, build/kiểm tra được và commit riêng. Backend cần có thể cấu hình để dùng các hệ quản trị quan hệ khác nhau mà không ràng buộc logic nghiệp vụ vào SQL Server.

## Hiện trạng đã khảo sát

- Stack là Java 21, Spring Boot 3.4.4, Spring Data JPA; driver hiện tại chỉ có SQL Server. PostgreSQL là database đích deploy đã xác nhận.
- Source đã chia thành các package nghiệp vụ như `auth`, `users`, `finance`, `health`, cùng `common`, `config`, `security`.
- Các package `users` và `finance` đã có một phần controller/service/repository/entity/DTO; cấu trúc chưa đồng nhất.
- `AuthController` đang chứa danh sách user giả lập trong RAM và tự xử lý đăng nhập/đăng ký/OTP.
- `HealthMetricController` tự đọc JWT, bắt exception và quyết định HTTP status; `HealthMetricService` có nhánh tạo Member/User giả khi không tìm thấy dữ liệu.
- `UserService` có mapping DTO thủ công, kiểm tra soft delete trong service bằng `findAll`, và ném exception tổng quát ở một số đường đi.
- `application.yml` đang ghim URL/driver/dialect SQL Server, bật `ddl-auto: update` và SQL log.
- Quy tắc repo đã yêu cầu package-by-feature, DTO, validation, transaction ở service, global error handler, không expose entity, OpenAPI cập nhật khi đổi API, và giữ các bất invariants đã nêu ở root `AGENTS.md`.

## Thiết kế được đề xuất

### Cấu trúc và trách nhiệm

Giữ package-by-feature làm trục chính; từng feature áp dụng nhất quán các package `controller`, `service`, `repository`, `entity`, `dto`, và `mapper` khi có mapping đáng kể. Không tạo một bộ ba thư mục global chứa logic của mọi feature.

- Controller chỉ nhận HTTP input, áp dụng validation, gọi use case/service và ánh xạ kết quả sang HTTP response. Không truy cập repository, chứa luật nghiệp vụ, xác thực token thủ công, hoặc bắt exception nghiệp vụ để tự phân loại status.
- Service/use case là ranh giới nghiệp vụ; chịu trách nhiệm điều phối, kiểm tra luật, transaction và gọi abstraction bên dưới. Tách service khi có nhiều trách nhiệm hoặc nhiều actor/use case độc lập, không tạo interface cho mọi class một cách máy móc.
- Repository là abstraction persistence của feature và dùng Spring Data JPA. Query lọc dữ liệu ngay tại database khi phù hợp; không tải toàn bảng rồi lọc trong bộ nhớ.
- Entity chỉ biểu diễn persistence/domain state; không trả trực tiếp qua API. DTO request/response và mapper giữ ranh giới API tách khỏi entity.
- `common` chỉ chứa concern thực sự dùng chung như lỗi/API response; không biến thành nơi gom logic nghiệp vụ.

### SOLID và IoC

- SRP: mỗi controller, service/use case, mapper, repository adapter và configuration có một lý do chính để thay đổi.
- OCP/LSP: biến thể có ý nghĩa được mở rộng qua contract nhỏ (ví dụ OTP sender, database-specific adapter); implement contract phải giữ đúng hậu điều kiện. Tránh framework abstraction hoặc hierarchy không có nhiều implementation thực tế.
- ISP: chia contract theo use case/khả năng cần dùng, không buộc consumer phụ thuộc vào API lớn không liên quan.
- DIP: business service phụ thuộc abstraction cho tích hợp thay đổi theo môi trường (OTP/email, clock nếu cần deterministic behavior, hoặc adapter vendor-specific); Spring constructor injection quản lý vòng đời. Dùng interface ở ranh giới có khả năng thay thế/kiểm thử, không tạo interface trùng lặp cho repository/service thuần CRUD nếu không tăng khả năng thay thế.
- Không dùng field injection, service locator, static mutable state hoặc tự khởi tạo dependency trong business code.

### JPA và khả năng thay database

- Giữ domain persistence trên Jakarta Persistence/Spring Data JPA và ưu tiên JPQL/Criteria/derived queries chuẩn thay vì native SQL gắn vendor.
- Database connection, driver, dialect (nếu bắt buộc), schema/migration và các adapter phụ thuộc vendor được cấu hình tách theo Spring profile/environment. Không để URL, credentials hay bí mật trong cấu hình mặc định hoặc code.
- Tắt `ddl-auto: update` cho luồng chạy thật; schema được quản lý bằng migration có version. Migration của từng engine đặt tách theo engine khi cú pháp/feature không portable.
- Dùng H2 cho kiểm thử persistence nhanh nếu tương thích mapping, nhưng không xem H2 là bằng chứng thay thế được SQL Server. Bổ sung PostgreSQL làm kiểm thử tích hợp bắt buộc cho cấu hình deploy đích. Giữ kiểm thử SQL Server cho trigger, computed column, capacity/overlap constraints và hành vi đặc thù đang được hỗ trợ.
- Thiết kế core không phụ thuộc SQL Server. Bất kỳ native query, error code/constraint mapping, trigger hoặc computed column đặc thù nào phải cô lập sau adapter/configuration theo provider và giữ contract chung.
- Phạm vi: PostgreSQL là engine triển khai mục tiêu; SQL Server tiếp tục được hỗ trợ trong giai đoạn chuyển đổi. Chỉ gọi một engine là được hỗ trợ khi có driver, migration tương ứng và kiểm chứng integration test trên chính engine đó.

### Lỗi, xác thực và hợp đồng API

- Dùng global exception handler để ánh xạ exception nghiệp vụ/validation/persistence sang response thống nhất; không trả stack trace hoặc chi tiết database ra client.
- Tận dụng Spring Security principal để truyền identity/authority thay vì controller tự parse JWT. Backend tiếp tục kiểm tra role; UI/menu không thay authorization.
- Giữ nguyên route, request/response và status code khi đó là hành vi hợp đồng hiện tại. Trường hợp sửa hành vi giả lập trong auth/health, cập nhật `docs/api-contracts/` trước hoặc cùng thay đổi; cập nhật OpenAPI annotations nếu cần.
- Không log password, OTP bí mật, JWT, connection secret hoặc dữ liệu sức khỏe nhạy cảm. Dùng logging có context ở ranh giới adapter/service để lần theo request mà không lộ dữ liệu.

### Bất biến cần giữ

- Chỉ Member có subscription `active`, chưa hết hạn mới booking/check-in.
- DB trigger kiểm tra capacity và trùng lịch phải được giữ; ánh xạ lỗi SQL thành lỗi HTTP có nghĩa, không tắt trigger.
- User có `deleted_at` không được xác thực hoặc xuất hiện trong list mặc định.
- Backend luôn kiểm tra role.
- Không bổ sung native mobile, payment gateway thật, AI provider thật, PDF/export hoặc thay database schema ngoài phạm vi ticket.

## Cách chia triển khai và commit

Refactor theo vertical slice, mỗi commit chỉ chứa một phần dễ review và phải build được. Thứ tự đề xuất sau khi được duyệt:

1. Quy tắc contributor/agent trong `rules/backend-architecture.md` và liên kết mục tiêu từ root `AGENTS.md`.
2. Nền tảng chung: exception taxonomy/handler, cấu hình persistence/environment và quy tắc logging/transaction; không đổi route nghiệp vụ.
3. Feature users/roles/profile: repository query, service boundary, DTO/mapper, soft-delete và authorization invariants.
4. Feature auth: thay RAM fake users bằng persistence/use case phù hợp với entity/schema; cô lập OTP delivery bằng port + adapter; giữ hoặc cập nhật contract đã công bố.
5. Feature health: lấy identity từ security principal, bỏ tạo entity mẫu, tách authorization/use cases và giữ dữ liệu sức khỏe kín.
6. Feature finance: thống nhất lớp/mapper/transaction và xác nhận computed columns bằng integration test.
7. Thêm profile PostgreSQL, driver và migration riêng; chạy integration test PostgreSQL. Rà soát package còn lại, xóa code chết hoặc package rỗng chỉ khi chứng minh không còn tham chiếu; đồng bộ OpenAPI và tài liệu chạy.

Mỗi bước có commit riêng với nội dung rõ ràng; không gộp nhiều feature lớn trong cùng commit. Không commit khi build/kiểm tra liên quan còn lỗi hoặc khi có thay đổi ngoài phạm vi chưa được phân loại. Trước commit đầu tiên phải kiểm tra git status để không đưa thay đổi có sẵn của người dùng vào commit.

## Kiểm tra chấp nhận

- Từng commit build bằng Maven và có test phù hợp với phần vừa đổi; chạy test đầy đủ ở điểm tích hợp cuối.
- Controller không gọi repository trực tiếp; business rules không nằm trong controller; entity không xuất hiện trong response contract.
- Luồng auth/health không còn dữ liệu giả tồn tại trong RAM hoặc tự sinh user/member để che lỗi thiếu dữ liệu.
- PostgreSQL profile và migration chạy được trên PostgreSQL; đây là cấu hình deploy đích.
- SQL Server vẫn chạy đúng trong giai đoạn chuyển đổi với schema, computed columns, trigger và soft delete hiện tại.
- Cấu hình engine không cần sửa code nghiệp vụ; engine bổ sung chỉ được tuyên bố hỗ trợ sau integration test thật.
- `rules/backend-architecture.md` có checklist rõ cho agent và developer, đồng bộ với root `AGENTS.md`.
- Route/DTO/status hiện hành và OpenAPI tương ứng được giữ đồng bộ.

## Ngoài phạm vi

- Thay đổi nghiệp vụ hoặc thiết kế database ngoài điều chỉnh cần thiết để chuyển persistence an toàn.
- Đảm bảo tự động tương thích với mọi hệ quản trị cơ sở dữ liệu mà không có migration/provider test riêng.
- Viết lại toàn bộ API hoặc đổi response chỉ để chuẩn hóa hình thức.
- Tắt trigger, bỏ validation role/subscription, hoặc chuyển giao trách nhiệm authorization sang frontend.

## Điểm cần chốt khi lập kế hoạch

Backend hiện chỉ có driver SQL Server; PostgreSQL là đích deploy đã xác nhận. Yêu cầu hỗ trợ nhiều database yêu cầu business layer độc lập engine và migration/profile riêng cho PostgreSQL và SQL Server; không tuyên bố tương thích mọi engine. PostgreSQL là đích deploy; SQL Server tiếp tục được hỗ trợ trong giai đoạn chuyển đổi. Mỗi engine có profile, migration và integration test riêng.
