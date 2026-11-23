# Meo Cung - MedusaJS v2 Backend

Backend thương mại điện tử chuyên dụng cho Shop Mèo Cưng, tích hợp Medusa Admin Dashboard và Store API.

## Cấu trúc hệ thống
- **Medusa Framework**: v2.18.0
- **Admin Dashboard**: Tự động phục vụ tại `/app`
- **Storefront**: Next.js Storefront (Vercel)

## Biến môi trường trên Render
- `DATABASE_URL`: URL PostgreSQL (từ Render PostgreSQL)
- `JWT_SECRET`: meocung_jwt_secret_key_2026_super_secure
- `COOKIE_SECRET`: meocung_cookie_secret_2026_secure
- `STORE_CORS`: `http://localhost:3000,https://meocung-ecommerce-seven.vercel.app`
- `ADMIN_CORS`: `http://localhost:9000,https://meocung-ecommerce-seven.vercel.app`
- `AUTH_CORS`: `http://localhost:9000,https://meocung-ecommerce-seven.vercel.app`
- `PORT`: `9000`
- `NODE_ENV`: `production`

## Lệnh chạy
- **Build Command**: `npm run build`
- **Start Command**: `npx medusa db:migrate && npm run start`
- **Tạo tài khoản Admin**: `npx medusa user --email admin@meocung.vn --password adminmeocung2026`
