import { defineConfig } from "drizzle-kit";

// Mặc định DATABASE_URL cho môi trường dev
const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_NgY5QL6fnIxd@ep-raspy-morning-a6okjlxx.us-west-2.aws.neon.tech/neondb?sslmode=require';

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
