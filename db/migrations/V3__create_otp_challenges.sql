IF OBJECT_ID('dbo.otp_challenges', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.otp_challenges (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        target NVARCHAR(255) NOT NULL UNIQUE,
        code_hash NVARCHAR(100) NOT NULL,
        expires_at DATETIME2 NOT NULL,
        failed_attempts INT NOT NULL DEFAULT 0,
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
    );
END;
GO
