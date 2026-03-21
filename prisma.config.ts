// prisma.config.ts — Prisma v7 config (URLs live here, NOT in schema.prisma)
import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Pooled connection for runtime queries
    url: process.env.DATABASE_URL!,
    // Direct connection for migrations (bypasses PgBouncer)
    directUrl: process.env.DATABASE_URL_UNPOOLED,
  },
})
