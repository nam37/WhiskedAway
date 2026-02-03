import pg from "pg";

let pool;

export function isDatabaseConfigured() {
  const url = process.env.DATABASE_URL || "";
  if (!url) return false;
  if (url.includes("host:5432/db")) return false;
  return true;
}

export function getPool() {
  if (pool) return pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const sslEnabled = process.env.DATABASE_SSL !== "false";
  const ssl = sslEnabled ? { rejectUnauthorized: false } : undefined;
  pool = new pg.Pool({ connectionString, ssl });
  return pool;
}

export async function query(text, params) {
  const activePool = getPool();
  return activePool.query(text, params);
}
