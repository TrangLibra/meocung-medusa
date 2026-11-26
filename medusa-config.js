const { loadEnv, defineConfig } = require('@medusajs/framework/utils')

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  admin: {
    disable: false,
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000,http://localhost:5173,https://meocung-ecommerce-seven.vercel.app",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000,http://localhost:7001,http://localhost:5173,https://meocung-ecommerce-seven.vercel.app,https://meocung-medusa-sigma.vercel.app",
      authCors: process.env.AUTH_CORS || "http://localhost:9000,http://localhost:7001,http://localhost:5173,http://localhost:3000,https://meocung-ecommerce-seven.vercel.app,https://meocung-medusa-sigma.vercel.app",
      jwtSecret: process.env.JWT_SECRET || "meocung_jwt_secret_key_2026_super_secure",
      cookieSecret: process.env.COOKIE_SECRET || "meocung_cookie_secret_2026_secure",
    }
  }
})
