/**
 * SQLite-backed offline database for caching API responses locally.
 * Each app gets its own database. Data is stored with TTL and version.
 * Works alongside the existing action queue (which handles mutations).
 */
import * as SQLite from "expo-sqlite";

interface CachedRecord {
  key: string;
  data: string; // JSON stringified
  version: number;
  expiresAt: number;
  updatedAt: number;
}

class OfflineDatabase {
  private db: SQLite.SQLiteDatabase | null = null;
  private dbName: string;

  constructor(dbName: string = "empire_cache") {
    this.dbName = dbName;
  }

  async init(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync(this.dbName);
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS cache (
        key TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        version INTEGER DEFAULT 1,
        expires_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_cache_expires ON cache(expires_at);
    `);
  }

  async get<T>(
    key: string
  ): Promise<{ data: T; isStale: boolean; updatedAt: number } | null> {
    if (!this.db) await this.init();
    const row = await this.db!.getFirstAsync<CachedRecord>(
      "SELECT * FROM cache WHERE key = ?",
      [key]
    );
    if (!row) return null;
    const isStale = Date.now() > row.expiresAt;
    return {
      data: JSON.parse(row.data) as T,
      isStale,
      updatedAt: row.updatedAt,
    };
  }

  async set<T>(
    key: string,
    data: T,
    ttlMs: number = 5 * 60 * 1000
  ): Promise<void> {
    if (!this.db) await this.init();
    const now = Date.now();
    await this.db!.runAsync(
      `INSERT OR REPLACE INTO cache (key, data, version, expires_at, updated_at)
       VALUES (?, ?, COALESCE((SELECT version FROM cache WHERE key = ?), 0) + 1, ?, ?)`,
      [key, JSON.stringify(data), key, now + ttlMs, now]
    );
  }

  async invalidate(keyPattern: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.runAsync("DELETE FROM cache WHERE key LIKE ?", [
      `${keyPattern}%`,
    ]);
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.runAsync("DELETE FROM cache");
  }

  async prune(): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.runAsync("DELETE FROM cache WHERE expires_at < ?", [
      Date.now(),
    ]);
  }

  async getSize(): Promise<number> {
    if (!this.db) await this.init();
    const row = await this.db!.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM cache"
    );
    return row?.count ?? 0;
  }
}

export const offlineDb = new OfflineDatabase();
export { OfflineDatabase };
