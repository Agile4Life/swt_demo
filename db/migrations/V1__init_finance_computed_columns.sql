-- =====================================================================
-- MIGRATION V1: FINANCE MODULE (PAYMENTS, INVOICES & COMPUTED COLUMNS)
-- Microsoft SQL Server 2019+ (T-SQL)
-- =====================================================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'payments' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
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

    CREATE INDEX ix_payments_member_status ON dbo.payments (member_id, status);
    CREATE INDEX ix_payments_paid_at ON dbo.payments (paid_at);
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'invoices' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.invoices (
        id                  BIGINT IDENTITY(1,1) PRIMARY KEY,
        payment_id          BIGINT NOT NULL UNIQUE,
        invoice_number      NVARCHAR(50) NOT NULL UNIQUE,
        issued_at           DATETIME2 NOT NULL,
        subtotal_amount     DECIMAL(12,2) NOT NULL,
        tax_amount          DECIMAL(12,2) NOT NULL DEFAULT 0,
        -- [FIX 1NF-3NF §3.6] total_amount là thuộc tính suy diễn từ subtotal_amount + tax_amount.
        -- Dùng COMPUTED COLUMN PERSISTED thay vì cột lưu tay để không bao giờ bị lệch dữ liệu tài chính.
        total_amount        AS (subtotal_amount + tax_amount) PERSISTED,
        pdf_url             NVARCHAR(255) NULL,
        created_at          DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT fk_invoices_payment FOREIGN KEY (payment_id) REFERENCES dbo.payments(id)
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'invoice_items' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.invoice_items (
        id              BIGINT IDENTITY(1,1) PRIMARY KEY,
        invoice_id      BIGINT NOT NULL,
        description     NVARCHAR(255) NOT NULL,
        quantity        INT NOT NULL DEFAULT 1,
        unit_price      DECIMAL(12,2) NOT NULL,
        -- [FIX 1NF-3NF §3.6] amount là thuộc tính suy diễn từ quantity * unit_price.
        -- Cột tính toán lưu vật lý PERSISTED chống sai lệch số liệu.
        amount          AS (quantity * unit_price) PERSISTED,
        CONSTRAINT fk_invoice_items_invoice FOREIGN KEY (invoice_id) REFERENCES dbo.invoices(id) ON DELETE CASCADE
    );
END;
