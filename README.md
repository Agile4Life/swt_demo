# SWT Demo — Hướng dẫn triển khai

Tài liệu này mô tả cách deploy project theo luồng:

```
Supabase (Database) → Render (Backend) → Vercel (Frontend) → GitHub Actions (CI/CD)
```

> Không đưa mật khẩu, API key, token hoặc JWT secret thật vào GitHub.

## 1. Chuẩn bị

- Tài khoản GitHub, Supabase, Render và Vercel.
- Repo đã fork về tài khoản cá nhân.
- Xác định thư mục backend/frontend trong repo.
- Kiểm tra file `Dockerfile`, `vercel.json` và `.env.example`.

## 2. Tạo database trên Supabase

1. Tạo Organization và Project mới.
2. Đặt database password mạnh và lưu lại an toàn.
3. Vào **Connect → Direct/Session pooler** để lấy:
   - host
   - port
   - database name
   - username
4. Khi dùng Spring Boot, URL thường có dạng:

```
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:<port>/<database>
SPRING_DATASOURCE_USERNAME=<username>
SPRING_DATASOURCE_PASSWORD=<database-password>
```

Không để mật khẩu trong URL nếu project đã tách riêng username/password.

## 3. Tạo JWT secret

PowerShell hoặc Terminal:

```powershell
node -p "require('crypto').randomBytes(64).toString('base64')"
```

Gán kết quả vào:

```env
APP_JWT_SECRET=<chuỗi-vừa-tạo>
```

JWT secret là khóa backend dùng để ký và xác minh token đăng nhập. Tạo một khóa riêng cho mỗi project/môi trường và không chia sẻ công khai.

## 4. Deploy backend lên Render

1. Render → **New → Web Service**.
2. Chọn repo GitHub và branch cần deploy.
3. Nếu repo dùng Docker, chọn **Docker**.
4. Điền đúng đường dẫn theo cấu trúc repo. Ví dụ:
   - Root Directory: `apps/api`
   - Docker Build Context: `.`
   - Dockerfile Path: `Dockerfile`
5. Health Check Path:

```
/api/v1/health
```

6. Thêm các biến môi trường:

```env
SPRING_PROFILES_ACTIVE=supabase
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/postgres
SPRING_DATASOURCE_USERNAME=<supabase-username>
SPRING_DATASOURCE_PASSWORD=<supabase-password>
APP_JWT_SECRET=<jwt-secret>
APP_CORS_ALLOWED_ORIGINS=https://<frontend-domain>
APP_WEB_ORIGIN=https://<frontend-domain>
```

7. Deploy và kiểm tra:

```
https://<render-domain>/api/v1/health
```

Kết quả hợp lệ thường có `"status":"UP"`.

## 5. Deploy frontend lên Vercel

1. Fork repo về tài khoản cá nhân.
2. Vercel → **New Project → Import Git Repository**.
3. Chọn đúng repo và đặt Root Directory là thư mục frontend, ví dụ `apps/web`.
4. Chọn preset phù hợp, ví dụ **Vite**.
5. Thêm biến:

```env
VITE_API_BASE_URL=/api/v1
```

6. Nếu dùng `vercel.json`, cấu hình rewrite API về backend Render:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://<render-domain>/api/:path*"
    }
  ]
}
```

7. Deploy và kiểm tra:

```
https://<vercel-domain>
https://<vercel-domain>/api/v1/health
```

Sau khi biết domain Vercel, cập nhật lại `APP_CORS_ALLOWED_ORIGINS` và `APP_WEB_ORIGIN` trên Render.

## 6. GitHub Actions

Vào **Repository → Settings → Secrets and variables → Actions**.

### Repository Secrets

Thêm các secret:

```text
RENDER_API_KEY       Token API của Render
RENDER_SERVICE_ID    ID service Render, dạng srv-...
VERCEL_TOKEN         Token của Vercel
VERCEL_ORG_ID        ID tài khoản/team Vercel
VERCEL_PROJECT_ID    ID project Vercel
```

### Repository Variables

Có thể thêm biến không nhạy cảm:

```text
FRONTEND_URL=https://<vercel-domain>
```

Secret được mã hóa và ẩn; Variable là dữ liệu thông thường, có thể hiển thị. Không dán nhiều cặp `KEY=VALUE` vào một ô Secret: mỗi secret phải có đúng một tên và một giá trị.

Nếu workflow trên fork bị tắt, vào tab **Actions** và chọn **I understand my workflows, go ahead and enable them**. Sau đó chạy workflow kiểm tra bằng **Run workflow**.

## 7. CORS và thứ tự cập nhật

```
1. Tạo Supabase
2. Deploy Render backend
3. Deploy Vercel frontend
4. Lấy domain Vercel
5. Cập nhật CORS/WEB_ORIGIN trên Render
6. Kiểm tra frontend và API
7. Bật/chạy GitHub Actions
```

## Cheatsheet

### Tạo JWT secret

```powershell
node -p "require('crypto').randomBytes(64).toString('base64')"
```

### Kiểm tra API bằng PowerShell

```powershell
Invoke-WebRequest "https://<domain>/api/v1/health"
```

### Kiểm tra API bằng trình duyệt

```text
https://<domain>/api/v1/health
```

### Mẫu Render env

```env
SPRING_PROFILES_ACTIVE=supabase
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/postgres
SPRING_DATASOURCE_USERNAME=<username>
SPRING_DATASOURCE_PASSWORD=<password>
APP_JWT_SECRET=<secret>
APP_CORS_ALLOWED_ORIGINS=https://<vercel-domain>
APP_WEB_ORIGIN=https://<vercel-domain>
```

### Mẫu Vercel env

```env
VITE_API_BASE_URL=/api/v1
```

### Mẫu GitHub Actions

```text
Secrets:
RENDER_API_KEY
RENDER_SERVICE_ID
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID

Variable:
FRONTEND_URL
```

## Lưu ý bảo mật

- Không commit `.env` thật.
- Không chụp hoặc gửi token/API key công khai.
- Nếu lộ secret, revoke/xóa và tạo secret mới ngay.
- Không dùng database password hoặc JWT secret của project khác.
- Dùng domain không có dấu `/` cuối cho CORS, ví dụ `https://example.vercel.app`.
