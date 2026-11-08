-- =====================================================================
-- SPORTS CENTER MANAGEMENT SYSTEM — DATABASE SCHEMA
-- RDBMS: Microsoft SQL Server 2019+ (T-SQL)
-- Tài liệu thiết kế đi kèm: database_design_sports_center.md
--
-- GHI CHÚ CHUYỂN ĐỔI SO VỚI BẢN MYSQL/POSTGRESQL:
--  1. AUTO_INCREMENT / BIGSERIAL -> BIGINT IDENTITY(1,1)
--  2. ENUM               -> không có kiểu ENUM native trong SQL Server
--                           => dùng NVARCHAR + CHECK CONSTRAINT liệt kê giá trị hợp lệ
--  3. VARCHAR             -> đổi thành NVARCHAR để lưu đúng tiếng Việt có dấu (Unicode)
--  4. JSON                -> không có kiểu JSON native => NVARCHAR(MAX) + CHECK (ISJSON(col)=1)
--  5. BOOLEAN              -> BIT (0/1)
--  6. TIMESTAMP tự cập nhật ON UPDATE -> không có sẵn => dùng TRIGGER AFTER UPDATE
--  7. now()/CURRENT_TIMESTAMP -> SYSDATETIME() hoặc GETDATE()
--  8. Câu lệnh CREATE TRIGGER phải là câu lệnh đầu tiên trong batch -> cần GO trước mỗi trigger
-- =====================================================================

-- =====================================================================
-- 0. TẠO DATABASE
-- =====================================================================
-- CREATE DATABASE phải nằm trong batch riêng (trước GO đầu tiên), không được
-- gộp chung batch với các câu lệnh khác. Đổi tên "SportsCenterDB" nếu muốn.

IF DB_ID(N'SportsCenterDB') IS NULL
BEGIN
    CREATE DATABASE SportsCenterDB;
END
GO

USE SportsCenterDB;
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

-- =====================================================================
-- MODULE A: ĐỊNH DANH & PHÂN QUYỀN
-- =====================================================================

CREATE TABLE dbo.roles (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    code            NVARCHAR(50)  NOT NULL UNIQUE,
    name            NVARCHAR(100) NOT NULL,
    description     NVARCHAR(255) NULL,
    created_at      DATETIME2     NOT NULL DEFAULT SYSDATETIME()
);
GO

CREATE TABLE dbo.permissions (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    code            NVARCHAR(100) NOT NULL UNIQUE,
    name            NVARCHAR(150) NOT NULL,
    module          NVARCHAR(50)  NOT NULL,
    created_at      DATETIME2     NOT NULL DEFAULT SYSDATETIME()
);
GO

CREATE TABLE dbo.role_permissions (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    role_id         BIGINT NOT NULL,
    permission_id   BIGINT NOT NULL,
    CONSTRAINT uq_role_permission UNIQUE (role_id, permission_id),
    CONSTRAINT fk_rp_role       FOREIGN KEY (role_id) REFERENCES dbo.roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES dbo.permissions(id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.users (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    role_id         BIGINT NOT NULL,
    full_name       NVARCHAR(150) NOT NULL,
    email           NVARCHAR(150) NOT NULL UNIQUE,
    username        NVARCHAR(50) NULL,
    phone           NVARCHAR(20)  NULL,
    password_hash   NVARCHAR(255) NOT NULL,
    dob             DATE NULL,
    gender          NVARCHAR(10) NULL
                    CONSTRAINT ck_users_gender CHECK (gender IN ('male','female','other')),
    avatar_url      NVARCHAR(255) NULL,
    address         NVARCHAR(255) NULL,
    status          NVARCHAR(20) NOT NULL DEFAULT 'active'
                    CONSTRAINT ck_users_status CHECK (status IN ('active','inactive','locked')),
    last_login_at   DATETIME2 NULL,
    created_at      DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at      DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    deleted_at      DATETIME2 NULL,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES dbo.roles(id)
);
GO
CREATE INDEX ix_users_role ON dbo.users (role_id);
CREATE UNIQUE INDEX uq_users_username ON dbo.users (username) WHERE username IS NOT NULL;
CREATE UNIQUE INDEX uq_users_phone ON dbo.users (phone) WHERE phone IS NOT NULL;
GO

CREATE TRIGGER dbo.trg_users_updated_at
ON dbo.users
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE u SET updated_at = SYSDATETIME()
    FROM dbo.users u INNER JOIN inserted i ON u.id = i.id;
END;
GO

CREATE TABLE dbo.otp_challenges (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    target          NVARCHAR(255) NOT NULL UNIQUE,
    code_hash       NVARCHAR(100) NOT NULL,
    expires_at      DATETIME2 NOT NULL,
    failed_attempts INT NOT NULL DEFAULT 0,
    created_at      DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO
CREATE TABLE dbo.members (
    user_id                     BIGINT PRIMARY KEY,
    membership_code             NVARCHAR(30) NOT NULL UNIQUE,
    join_date                   DATE NOT NULL,
    health_notes                NVARCHAR(MAX) NULL,
    fitness_goal                NVARCHAR(255) NULL,
    fitness_level               NVARCHAR(20) NOT NULL DEFAULT 'beginner'
                                CONSTRAINT ck_members_level CHECK (fitness_level IN ('beginner','intermediate','advanced')),
    emergency_contact_name      NVARCHAR(150) NULL,
    emergency_contact_phone     NVARCHAR(20) NULL,
    CONSTRAINT fk_members_user FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.coaches (
    user_id             BIGINT PRIMARY KEY,
    specialization      NVARCHAR(150) NULL,
    bio                 NVARCHAR(MAX) NULL,
    certification       NVARCHAR(255) NULL,
    hire_date           DATE NULL,
    employment_status   NVARCHAR(20) NOT NULL DEFAULT 'active'
                        CONSTRAINT ck_coaches_status CHECK (employment_status IN ('active','on_leave','terminated')),
    CONSTRAINT fk_coaches_user FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.receptionists (
    user_id             BIGINT PRIMARY KEY,
    hire_date           DATE NULL,
    shift               NVARCHAR(50) NULL,
    employment_status   NVARCHAR(20) NOT NULL DEFAULT 'active'
                        CONSTRAINT ck_receptionists_status CHECK (employment_status IN ('active','on_leave','terminated')),
    CONSTRAINT fk_receptionists_user FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.center_managers (
    user_id     BIGINT PRIMARY KEY,
    hire_date   DATE NULL,
    CONSTRAINT fk_center_managers_user FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE CASCADE
);
GO

-- =====================================================================
-- MODULE B: DANH MỤC / CƠ SỞ VẬT CHẤT
-- =====================================================================

CREATE TABLE dbo.disciplines (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    name            NVARCHAR(100) NOT NULL UNIQUE,
    description     NVARCHAR(MAX) NULL,
    created_at      DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

CREATE TABLE dbo.rooms (
    id          BIGINT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(100) NOT NULL,
    location    NVARCHAR(150) NULL,
    capacity    INT NOT NULL,
    status      NVARCHAR(20) NOT NULL DEFAULT 'available'
               CONSTRAINT ck_rooms_status CHECK (status IN ('available','maintenance','closed'))
);
GO

CREATE TABLE dbo.membership_packages (
    id                   BIGINT IDENTITY(1,1) PRIMARY KEY,
    name                 NVARCHAR(150) NOT NULL,
    description          NVARCHAR(MAX) NULL,
    price                DECIMAL(12,2) NOT NULL,
    duration_days        INT NOT NULL,
    class_credit_limit   INT NULL,
    status               NVARCHAR(20) NOT NULL DEFAULT 'active'
                        CONSTRAINT ck_packages_status CHECK (status IN ('active','inactive')),
    created_by           BIGINT NULL,
    created_at           DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at           DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_packages_created_by FOREIGN KEY (created_by) REFERENCES dbo.users(id)
);
GO

CREATE TRIGGER dbo.trg_packages_updated_at
ON dbo.membership_packages
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE p SET updated_at = SYSDATETIME()
    FROM dbo.membership_packages p INNER JOIN inserted i ON p.id = i.id;
END;
GO

-- =====================================================================
-- MODULE C: GÓI THÀNH VIÊN
-- =====================================================================

CREATE TABLE dbo.membership_subscriptions (
    id                          BIGINT IDENTITY(1,1) PRIMARY KEY,
    member_id                   BIGINT NOT NULL,
    package_id                  BIGINT NOT NULL,
    previous_subscription_id    BIGINT NULL,
    start_date                  DATE NOT NULL,
    end_date                    DATE NOT NULL,
    status                      NVARCHAR(20) NOT NULL DEFAULT 'pending_payment'
                                CONSTRAINT ck_subscriptions_status CHECK (status IN ('pending_payment','active','expired','cancelled')),
    qr_code                     NVARCHAR(255) NULL UNIQUE,
    created_by                  BIGINT NULL,
    created_at                  DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at                  DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_sub_member    FOREIGN KEY (member_id) REFERENCES dbo.members(user_id),
    CONSTRAINT fk_sub_package   FOREIGN KEY (package_id) REFERENCES dbo.membership_packages(id),
    CONSTRAINT fk_sub_previous  FOREIGN KEY (previous_subscription_id) REFERENCES dbo.membership_subscriptions(id),
    CONSTRAINT fk_sub_created_by FOREIGN KEY (created_by) REFERENCES dbo.users(id)
);
GO
CREATE INDEX ix_subscriptions_member_status ON dbo.membership_subscriptions (member_id, status);
CREATE INDEX ix_subscriptions_end_date ON dbo.membership_subscriptions (end_date);
GO

CREATE TRIGGER dbo.trg_subscriptions_updated_at
ON dbo.membership_subscriptions
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE s SET updated_at = SYSDATETIME()
    FROM dbo.membership_subscriptions s INNER JOIN inserted i ON s.id = i.id;
END;
GO

-- =====================================================================
-- MODULE D: LỚP HỌC & LỊCH
-- =====================================================================

CREATE TABLE dbo.classes (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    name            NVARCHAR(150) NOT NULL,
    discipline_id   BIGINT NOT NULL,
    coach_id        BIGINT NOT NULL,
    room_id         BIGINT NOT NULL,
    capacity        INT NOT NULL,
    level           NVARCHAR(20) NOT NULL DEFAULT 'all'
                   CONSTRAINT ck_classes_level CHECK (level IN ('beginner','intermediate','advanced','all')),
    description     NVARCHAR(MAX) NULL,
    status          NVARCHAR(20) NOT NULL DEFAULT 'active'
                   CONSTRAINT ck_classes_status CHECK (status IN ('active','inactive','archived')),
    created_by      BIGINT NULL,
    created_at      DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at      DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_classes_discipline FOREIGN KEY (discipline_id) REFERENCES dbo.disciplines(id),
    CONSTRAINT fk_classes_coach      FOREIGN KEY (coach_id) REFERENCES dbo.coaches(user_id),
    CONSTRAINT fk_classes_room       FOREIGN KEY (room_id) REFERENCES dbo.rooms(id),
    CONSTRAINT fk_classes_created_by FOREIGN KEY (created_by) REFERENCES dbo.users(id)
);
GO
CREATE INDEX ix_classes_coach ON dbo.classes (coach_id);
GO

CREATE TRIGGER dbo.trg_classes_updated_at
ON dbo.classes
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE c SET updated_at = SYSDATETIME()
    FROM dbo.classes c INNER JOIN inserted i ON c.id = i.id;
END;
GO

CREATE TABLE dbo.class_sessions (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    class_id        BIGINT NOT NULL,
    session_date    DATE NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    status          NVARCHAR(20) NOT NULL DEFAULT 'scheduled'
                   CONSTRAINT ck_sessions_status CHECK (status IN ('scheduled','completed','cancelled')),
    cancel_reason   NVARCHAR(255) NULL,
    created_at      DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at      DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_sessions_class FOREIGN KEY (class_id) REFERENCES dbo.classes(id) ON DELETE CASCADE
);
GO
CREATE INDEX ix_sessions_class_date ON dbo.class_sessions (class_id, session_date);
GO

CREATE TRIGGER dbo.trg_sessions_updated_at
ON dbo.class_sessions
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE s SET updated_at = SYSDATETIME()
    FROM dbo.class_sessions s INNER JOIN inserted i ON s.id = i.id;
END;
GO

CREATE TABLE dbo.class_enrollments (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    class_id        BIGINT NOT NULL,
    member_id       BIGINT NOT NULL,
    status          NVARCHAR(20) NOT NULL DEFAULT 'booked'
                   CONSTRAINT ck_enrollments_status CHECK (status IN ('booked','cancelled','completed')),
    enrolled_at     DATETIME2 NOT NULL,
    cancelled_at    DATETIME2 NULL,
    cancelled_by    BIGINT NULL,
    cancel_reason   NVARCHAR(255) NULL,
    CONSTRAINT fk_enrollments_class  FOREIGN KEY (class_id) REFERENCES dbo.classes(id),
    CONSTRAINT fk_enrollments_member FOREIGN KEY (member_id) REFERENCES dbo.members(user_id),
    CONSTRAINT fk_enrollments_cancelled_by FOREIGN KEY (cancelled_by) REFERENCES dbo.users(id)
);
GO
CREATE INDEX ix_enrollments_member_status ON dbo.class_enrollments (member_id, status);
CREATE INDEX ix_enrollments_class_status ON dbo.class_enrollments (class_id, status);
GO

-- [P1 — Booking history] Bỏ UNIQUE(class_id, member_id) cứng vì nó chặn luôn việc member
-- đăng ký lại một lớp đã từng hủy trước đó (mất khả năng lưu lịch sử booking).
-- Thay bằng filtered unique index: chỉ đảm bảo KHÔNG có 2 dòng 'booked' cùng lúc cho 1 cặp
-- (class_id, member_id); các dòng 'cancelled'/'completed' cũ vẫn giữ nguyên làm lịch sử.
CREATE UNIQUE INDEX uq_enrollment_active
ON dbo.class_enrollments (class_id, member_id)
WHERE status = 'booked';
GO

CREATE TABLE dbo.class_waitlists (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    class_id        BIGINT NOT NULL,
    member_id       BIGINT NOT NULL,
    requested_at    DATETIME2 NOT NULL,
    status          NVARCHAR(20) NOT NULL DEFAULT 'waiting'
                   CONSTRAINT ck_waitlist_status CHECK (status IN ('waiting','notified','expired')),
    CONSTRAINT fk_waitlist_class  FOREIGN KEY (class_id) REFERENCES dbo.classes(id),
    CONSTRAINT fk_waitlist_member FOREIGN KEY (member_id) REFERENCES dbo.members(user_id)
);
GO

-- [FIX 1NF-3NF §3.4] Ngăn 1 member bị chèn trùng nhiều dòng "đang chờ" cho cùng 1 lớp.
-- Dùng UNIQUE INDEX có điều kiện (filtered index) vì SQL Server hỗ trợ WHERE trên UNIQUE INDEX.
-- Sau khi status chuyển sang 'notified'/'expired', member có thể được thêm lại vào waitlist (dòng mới).
CREATE UNIQUE INDEX uq_waitlist_active
ON dbo.class_waitlists (class_id, member_id)
WHERE status = 'waiting';
GO

-- =====================================================================
-- MODULE E: CHECK-IN & ĐIỂM DANH
-- =====================================================================

CREATE TABLE dbo.center_checkins (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    member_id       BIGINT NOT NULL,
    check_in_time   DATETIME2 NOT NULL,
    check_out_time  DATETIME2 NULL,
    method          NVARCHAR(10) NOT NULL DEFAULT 'qr'
                   CONSTRAINT ck_checkins_method CHECK (method IN ('qr','manual')),
    recorded_by     BIGINT NULL,
    gate            NVARCHAR(50) NULL,
    CONSTRAINT fk_checkins_member      FOREIGN KEY (member_id) REFERENCES dbo.members(user_id),
    CONSTRAINT fk_checkins_recorded_by FOREIGN KEY (recorded_by) REFERENCES dbo.users(id)
);
GO
CREATE INDEX ix_checkins_member_time ON dbo.center_checkins (member_id, check_in_time);
GO

CREATE TABLE dbo.session_attendance (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    session_id      BIGINT NOT NULL,
    member_id       BIGINT NOT NULL,
    status          NVARCHAR(20) NOT NULL
                   CONSTRAINT ck_attendance_status CHECK (status IN ('present','absent','late','excused')),
    checked_in_at   DATETIME2 NULL,
    recorded_by     BIGINT NOT NULL,
    notes           NVARCHAR(255) NULL,
    CONSTRAINT uq_session_member UNIQUE (session_id, member_id),
    CONSTRAINT fk_attendance_session FOREIGN KEY (session_id) REFERENCES dbo.class_sessions(id),
    CONSTRAINT fk_attendance_member  FOREIGN KEY (member_id) REFERENCES dbo.members(user_id),
    CONSTRAINT fk_attendance_coach   FOREIGN KEY (recorded_by) REFERENCES dbo.coaches(user_id)
);
GO
CREATE INDEX ix_attendance_member ON dbo.session_attendance (member_id);
GO

-- =====================================================================
-- RÀNG BUỘC NGHIỆP VỤ BỔ SUNG (P1–P4)
-- P1 đã xử lý ở trên (filtered unique index cho class_enrollments).
-- P2, P3, P4 xử lý bằng TRIGGER vì đây đều là kiểm tra cross-row / cross-table
-- mà CHECK CONSTRAINT thông thường của SQL Server không làm được.
-- =====================================================================

-- ---------------------------------------------------------------------
-- [P2 — Class capacity] Không cho phép số lượng booking đang active ('booked')
-- của một lớp vượt quá classes.capacity.
-- ---------------------------------------------------------------------
CREATE TRIGGER dbo.trg_enrollments_check_capacity
ON dbo.class_enrollments
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN dbo.classes c ON c.id = i.class_id
        WHERE i.status = 'booked'
        AND (
            SELECT COUNT(*)
            FROM dbo.class_enrollments ce
            WHERE ce.class_id = i.class_id AND ce.status = 'booked'
        ) > c.capacity
    )
    BEGIN
        RAISERROR (N'Lớp học đã đầy chỗ (vượt quá capacity cho phép).', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

-- ---------------------------------------------------------------------
-- [P3 — Coach/Room schedule conflict] Không cho phép 2 buổi học (class_sessions)
-- cùng coach hoặc cùng room bị trùng/chồng lấn thời gian trong cùng một ngày.
-- Coach/Room được lấy gián tiếp qua classes (class_sessions.class_id -> classes.coach_id/room_id).
-- Điều kiện overlap chuẩn: NOT (end1 <= start2 OR start1 >= end2)
-- ---------------------------------------------------------------------
CREATE TRIGGER dbo.trg_sessions_check_conflict
ON dbo.class_sessions
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra trùng COACH
    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN dbo.classes c1 ON c1.id = i.class_id
        INNER JOIN dbo.class_sessions s2 ON s2.session_date = i.session_date AND s2.id <> i.id
        INNER JOIN dbo.classes c2 ON c2.id = s2.class_id
        WHERE i.status <> 'cancelled' AND s2.status <> 'cancelled'
        AND c1.coach_id = c2.coach_id
        AND NOT (i.end_time <= s2.start_time OR i.start_time >= s2.end_time)
    )
    BEGIN
        RAISERROR (N'Huấn luyện viên đã có lịch dạy trùng khung giờ này ở lớp khác.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Kiểm tra trùng ROOM
    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN dbo.classes c1 ON c1.id = i.class_id
        INNER JOIN dbo.class_sessions s2 ON s2.session_date = i.session_date AND s2.id <> i.id
        INNER JOIN dbo.classes c2 ON c2.id = s2.class_id
        WHERE i.status <> 'cancelled' AND s2.status <> 'cancelled'
        AND c1.room_id = c2.room_id
        AND NOT (i.end_time <= s2.start_time OR i.start_time >= s2.end_time)
    )
    BEGIN
        RAISERROR (N'Phòng tập đã được lớp khác sử dụng trùng khung giờ này.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

-- ---------------------------------------------------------------------
-- [P4 — Membership validation] Trước khi tạo booking (class_enrollments) hoặc
-- check-in (center_checkins), member phải có membership_subscriptions với
-- status = 'active' VÀ end_date >= ngày hiện tại (chưa hết hạn).
-- ---------------------------------------------------------------------
CREATE TRIGGER dbo.trg_enrollments_check_membership
ON dbo.class_enrollments
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        WHERE i.status = 'booked'
        AND NOT EXISTS (
            SELECT 1
            FROM dbo.membership_subscriptions ms
            WHERE ms.member_id = i.member_id
            AND ms.status = 'active'
            AND ms.end_date >= CAST(SYSDATETIME() AS DATE)
        )
    )
    BEGIN
        RAISERROR (N'Học viên không có gói thành viên còn hiệu lực để đăng ký lớp.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

CREATE TRIGGER dbo.trg_checkins_check_membership
ON dbo.center_checkins
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        WHERE NOT EXISTS (
            SELECT 1
            FROM dbo.membership_subscriptions ms
            WHERE ms.member_id = i.member_id
            AND ms.status = 'active'
            AND ms.end_date >= CAST(SYSDATETIME() AS DATE)
        )
    )
    BEGIN
        RAISERROR (N'Học viên không có gói thành viên còn hiệu lực để check-in.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

-- =====================================================================
-- MODULE F: THANH TOÁN & BÁO CÁO
-- =====================================================================

CREATE TABLE dbo.payments (
    id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    member_id               BIGINT NOT NULL,
    subscription_id         BIGINT NULL,
    class_enrollment_id     BIGINT NULL,
    amount                  DECIMAL(12,2) NOT NULL,
    method                  NVARCHAR(20) NOT NULL
                           CONSTRAINT ck_payments_method CHECK (method IN ('cash','pos','bank_transfer','online_wallet')),
    status                  NVARCHAR(20) NOT NULL DEFAULT 'pending'
                           CONSTRAINT ck_payments_status CHECK (status IN ('success','pending','failed','refunded')),
    paid_at                 DATETIME2 NULL,
    received_by             BIGINT NULL,
    note                    NVARCHAR(255) NULL,
    created_at              DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_payments_member       FOREIGN KEY (member_id) REFERENCES dbo.members(user_id),
    CONSTRAINT fk_payments_subscription FOREIGN KEY (subscription_id) REFERENCES dbo.membership_subscriptions(id),
    CONSTRAINT fk_payments_enrollment   FOREIGN KEY (class_enrollment_id) REFERENCES dbo.class_enrollments(id),
    CONSTRAINT fk_payments_received_by  FOREIGN KEY (received_by) REFERENCES dbo.users(id)
);
GO
CREATE INDEX ix_payments_member_status ON dbo.payments (member_id, status);
CREATE INDEX ix_payments_paid_at ON dbo.payments (paid_at);
GO

CREATE TABLE dbo.invoices (
    id                  BIGINT IDENTITY(1,1) PRIMARY KEY,
    payment_id          BIGINT NOT NULL UNIQUE,
    invoice_number      NVARCHAR(50) NOT NULL UNIQUE,
    issued_at           DATETIME2 NOT NULL,
    subtotal_amount     DECIMAL(12,2) NOT NULL,
    tax_amount          DECIMAL(12,2) NOT NULL DEFAULT 0,
    -- [FIX 1NF-3NF §3.6] total_amount là thuộc tính suy diễn từ subtotal_amount + tax_amount.
    -- Dùng COMPUTED COLUMN thay vì cột lưu tay để không bao giờ bị lệch dữ liệu.
    total_amount        AS (subtotal_amount + tax_amount) PERSISTED,
    pdf_url             NVARCHAR(255) NULL,
    created_at          DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_invoices_payment FOREIGN KEY (payment_id) REFERENCES dbo.payments(id)
);
GO

CREATE TABLE dbo.invoice_items (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    invoice_id      BIGINT NOT NULL,
    description     NVARCHAR(255) NOT NULL,
    quantity        INT NOT NULL DEFAULT 1,
    unit_price      DECIMAL(12,2) NOT NULL,
    -- [FIX 1NF-3NF §3.6] amount là thuộc tính suy diễn từ quantity * unit_price.
    amount          AS (quantity * unit_price) PERSISTED,
    CONSTRAINT fk_invoice_items_invoice FOREIGN KEY (invoice_id) REFERENCES dbo.invoices(id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.report_snapshots (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    report_type     NVARCHAR(30) NOT NULL
                   CONSTRAINT ck_report_type CHECK (report_type IN ('revenue','membership','class_utilization')),
    period_start    DATE NOT NULL,
    period_end      DATE NOT NULL,
    data            NVARCHAR(MAX) NOT NULL
                   CONSTRAINT ck_report_data_json CHECK (ISJSON(data) = 1),
    generated_by    BIGINT NULL,
    generated_at    DATETIME2 NOT NULL,
    CONSTRAINT fk_reports_generated_by FOREIGN KEY (generated_by) REFERENCES dbo.users(id)
);
GO

-- =====================================================================
-- MODULE G: HUẤN LUYỆN & ĐÁNH GIÁ
-- =====================================================================

CREATE TABLE dbo.training_plans (
    id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    member_id               BIGINT NOT NULL,
    coach_id                BIGINT NOT NULL,
    class_id                BIGINT NULL,
    goal                    NVARCHAR(255) NULL,
    start_date              DATE NOT NULL,
    end_date                DATE NOT NULL,
    status                  NVARCHAR(20) NOT NULL DEFAULT 'draft'
                           CONSTRAINT ck_plans_status CHECK (status IN ('draft','active','completed','cancelled')),
    is_ai_generated         BIT NOT NULL DEFAULT 0,
    ai_recommendation_id    BIGINT NULL, -- FK thêm bên dưới sau khi tạo ai_recommendation_logs
    created_at              DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at              DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_plans_member FOREIGN KEY (member_id) REFERENCES dbo.members(user_id),
    CONSTRAINT fk_plans_coach  FOREIGN KEY (coach_id) REFERENCES dbo.coaches(user_id),
    CONSTRAINT fk_plans_class  FOREIGN KEY (class_id) REFERENCES dbo.classes(id)
);
GO

CREATE TRIGGER dbo.trg_plans_updated_at
ON dbo.training_plans
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE p SET updated_at = SYSDATETIME()
    FROM dbo.training_plans p INNER JOIN inserted i ON p.id = i.id;
END;
GO

CREATE TABLE dbo.training_plan_items (
    id                  BIGINT IDENTITY(1,1) PRIMARY KEY,
    training_plan_id    BIGINT NOT NULL,
    day_of_week         TINYINT NULL
                       CONSTRAINT ck_plan_items_day CHECK (day_of_week BETWEEN 1 AND 7),
    exercise_name       NVARCHAR(150) NOT NULL,
    description         NVARCHAR(MAX) NULL,
    sets                INT NULL,
    reps                INT NULL,
    duration_minutes    INT NULL,
    order_index         INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_plan_items_plan FOREIGN KEY (training_plan_id) REFERENCES dbo.training_plans(id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.session_evaluations (
    id                  BIGINT IDENTITY(1,1) PRIMARY KEY,
    session_id          BIGINT NULL,
    member_id           BIGINT NOT NULL,
    coach_id            BIGINT NOT NULL,
    performance_notes   NVARCHAR(MAX) NULL,
    progress_score      DECIMAL(4,1) NULL,
    feedback            NVARCHAR(MAX) NULL,
    evaluated_at        DATETIME2 NOT NULL,
    created_at          DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_eval_session FOREIGN KEY (session_id) REFERENCES dbo.class_sessions(id),
    CONSTRAINT fk_eval_member  FOREIGN KEY (member_id) REFERENCES dbo.members(user_id),
    CONSTRAINT fk_eval_coach   FOREIGN KEY (coach_id) REFERENCES dbo.coaches(user_id)
);
GO

CREATE TABLE dbo.member_progress_logs (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    member_id       BIGINT NOT NULL,
    metric_name     NVARCHAR(100) NOT NULL,
    metric_value    DECIMAL(10,2) NOT NULL,
    unit            NVARCHAR(20) NULL,
    recorded_by     BIGINT NOT NULL,
    recorded_at     DATETIME2 NOT NULL,
    CONSTRAINT fk_progress_member      FOREIGN KEY (member_id) REFERENCES dbo.members(user_id),
    CONSTRAINT fk_progress_recorded_by FOREIGN KEY (recorded_by) REFERENCES dbo.users(id)
);
GO

-- =====================================================================
-- MODULE H: AI (OPTIONAL — FLOW 5 & FLOW 6)
-- =====================================================================

CREATE TABLE dbo.ai_recommendation_logs (
    id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    coach_id                BIGINT NULL,
    member_id               BIGINT NOT NULL,
    input_context           NVARCHAR(MAX) NOT NULL
                           CONSTRAINT ck_ai_input_json CHECK (ISJSON(input_context) = 1),
    recommended_content     NVARCHAR(MAX) NOT NULL
                           CONSTRAINT ck_ai_output_json CHECK (ISJSON(recommended_content) = 1),
    model_name              NVARCHAR(100) NULL,
    is_applied              BIT NOT NULL DEFAULT 0,
    created_at              DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_ai_reco_coach  FOREIGN KEY (coach_id) REFERENCES dbo.coaches(user_id),
    CONSTRAINT fk_ai_reco_member FOREIGN KEY (member_id) REFERENCES dbo.members(user_id)
);
GO

-- FK vòng: thêm sau khi ai_recommendation_logs đã tồn tại
ALTER TABLE dbo.training_plans
    ADD CONSTRAINT fk_plans_ai_recommendation
    FOREIGN KEY (ai_recommendation_id) REFERENCES dbo.ai_recommendation_logs(id);
GO

CREATE TABLE dbo.ai_chat_sessions (
    id          BIGINT IDENTITY(1,1) PRIMARY KEY,
    member_id   BIGINT NOT NULL,
    topic       NVARCHAR(150) NULL,
    started_at  DATETIME2 NOT NULL,
    ended_at    DATETIME2 NULL,
    CONSTRAINT fk_chat_sessions_member FOREIGN KEY (member_id) REFERENCES dbo.members(user_id)
);
GO

CREATE TABLE dbo.ai_chat_messages (
    id          BIGINT IDENTITY(1,1) PRIMARY KEY,
    session_id  BIGINT NOT NULL,
    sender      NVARCHAR(10) NOT NULL
               CONSTRAINT ck_chat_sender CHECK (sender IN ('member','ai')),
    message     NVARCHAR(MAX) NOT NULL,
    created_at  DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_chat_messages_session FOREIGN KEY (session_id) REFERENCES dbo.ai_chat_sessions(id) ON DELETE CASCADE
);
GO

-- =====================================================================
-- MODULE I: THÔNG BÁO & HỖ TRỢ
-- =====================================================================

CREATE TABLE dbo.notifications (
    id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id                 BIGINT NOT NULL,
    type                    NVARCHAR(30) NOT NULL
                           CONSTRAINT ck_notifications_type CHECK (type IN ('schedule_change','package_expiry','class_reminder','system','support_reply','payment')),
    title                   NVARCHAR(150) NOT NULL,
    message                 NVARCHAR(MAX) NOT NULL,
    is_read                 BIT NOT NULL DEFAULT 0,
    -- [FIX 1NF-3NF §3.8] FK đa hình: entity_id không có FOREIGN KEY thật vì có thể trỏ tới nhiều bảng.
    -- Bù lại bằng CHECK giới hạn danh sách bảng hợp lệ; entity_id phải được kiểm tra tồn tại ở tầng ứng dụng.
    related_entity_type     NVARCHAR(50) NULL
                           CONSTRAINT ck_notifications_entity_type CHECK (
                               related_entity_type IS NULL OR related_entity_type IN (
                                   'class_session','membership_subscription','payment',
                                   'support_request','class_enrollment','training_plan'
                               )
                           ),
    related_entity_id       BIGINT NULL,
    created_at              DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES dbo.users(id)
);
GO
CREATE INDEX ix_notifications_user_read ON dbo.notifications (user_id, is_read);
GO

CREATE TABLE dbo.support_requests (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    member_id       BIGINT NOT NULL,
    assigned_to     BIGINT NULL,
    subject         NVARCHAR(150) NOT NULL,
    description     NVARCHAR(MAX) NULL,
    status          NVARCHAR(20) NOT NULL DEFAULT 'open'
                   CONSTRAINT ck_support_status CHECK (status IN ('open','in_progress','resolved','closed')),
    created_at      DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    resolved_at     DATETIME2 NULL,
    CONSTRAINT fk_support_member      FOREIGN KEY (member_id) REFERENCES dbo.members(user_id),
    CONSTRAINT fk_support_assigned_to FOREIGN KEY (assigned_to) REFERENCES dbo.users(id)
);
GO

CREATE TABLE dbo.support_request_messages (
    id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    support_request_id      BIGINT NOT NULL,
    sender_user_id          BIGINT NOT NULL,
    message                 NVARCHAR(MAX) NOT NULL,
    created_at              DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_support_msg_request FOREIGN KEY (support_request_id) REFERENCES dbo.support_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_support_msg_sender  FOREIGN KEY (sender_user_id) REFERENCES dbo.users(id)
);
GO

-- =====================================================================
-- MODULE J: HỆ THỐNG
-- =====================================================================

CREATE TABLE dbo.audit_logs (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id         BIGINT NULL,
    action          NVARCHAR(100) NOT NULL,
    -- [FIX 1NF-3NF §3.8] FK đa hình tương tự notifications — giới hạn danh sách bảng được phép ghi log.
    entity_type     NVARCHAR(100) NOT NULL
                   CONSTRAINT ck_audit_entity_type CHECK (entity_type IN (
                       'users','members','coaches','receptionists','center_managers',
                       'membership_packages','membership_subscriptions',
                       'classes','class_sessions','class_enrollments','class_waitlists',
                       'center_checkins','session_attendance',
                       'payments','invoices','invoice_items',
                       'training_plans','training_plan_items','session_evaluations',
                       'notifications','support_requests','role_permissions'
                   )),
    entity_id       BIGINT NULL,
    old_value       NVARCHAR(MAX) NULL CONSTRAINT ck_audit_old_json CHECK (old_value IS NULL OR ISJSON(old_value) = 1),
    new_value       NVARCHAR(MAX) NULL CONSTRAINT ck_audit_new_json CHECK (new_value IS NULL OR ISJSON(new_value) = 1),
    ip_address      NVARCHAR(45) NULL,
    created_at      DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES dbo.users(id)
);
GO
CREATE INDEX ix_audit_entity ON dbo.audit_logs (entity_type, entity_id);
CREATE INDEX ix_audit_created_at ON dbo.audit_logs (created_at);
GO

-- =====================================================================
-- DỮ LIỆU KHỞI TẠO (SEED DATA) — Roles cơ bản
-- =====================================================================

INSERT INTO dbo.roles (code, name, description) VALUES
(N'CENTER_MANAGER', N'Quản lý Trung tâm', N'Quản trị toàn bộ hệ thống, danh mục, báo cáo'),
(N'COACH', N'Huấn luyện viên', N'Phụ trách lớp học, đánh giá học viên'),
(N'MEMBER', N'Học viên / Thành viên', N'Người dùng cuối, đăng ký gói và lớp học'),
(N'RECEPTIONIST', N'Nhân viên Lễ tân', N'Xử lý đăng ký, thanh toán, check-in tại quầy');
GO

-- =====================================================================
-- HẾT FILE
-- =====================================================================