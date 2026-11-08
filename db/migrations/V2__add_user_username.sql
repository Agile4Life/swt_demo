IF COL_LENGTH('dbo.users', 'username') IS NULL
BEGIN
    ALTER TABLE dbo.users ADD username NVARCHAR(50) NULL;
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'uq_users_username' AND object_id = OBJECT_ID('dbo.users'))
BEGIN
    CREATE UNIQUE INDEX uq_users_username ON dbo.users (username) WHERE username IS NOT NULL;
END;
GO