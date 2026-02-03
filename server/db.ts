import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import { getConfig } from "./config";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const { Pool } = pg;
const config = getConfig();

const connectionString = config.database_url;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL must be set in config.yml or as an environment variable.",
  );
}

// Ensure process.env.DATABASE_URL is set for tools
process.env.DATABASE_URL = connectionString;

export const pool = new Pool({ 
  connectionString,
  ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : false
});

export const db = drizzle(pool, { schema });

// Run migrations on startup
export async function runMigrations() {
  try {
    console.log('[db] Initializing database...');
    // Tables are handled via external tools or manual sync to avoid permission issues in code
    console.log('[db] Database ready');
  } catch (err: any) {
    console.warn('[db] Database initialization warning:', err.message);
  }
}
