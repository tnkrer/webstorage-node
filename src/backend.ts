import { StorageType, Storage } from "./types";
import sqlite3 from "better-sqlite3";

// Storage interface implementation
// Based on the HTML Living Standard specification
// https://html.spec.whatwg.org/multipage/webstorage.html

export class StorageBackend implements Storage {
  private database: sqlite3.Database;

  constructor(private type: StorageType) {
    this.database = sqlite3("webstorage-node.db", {
      memory: type === StorageType.SessionStorage,
    });

    this.database.exec(`
      CREATE TABLE IF NOT EXISTS webstorage(
        key TEXT PRIMARY KEY,
        value TEXT,
        added INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `);

    // Database#close()
    // Ref: https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md
    process.on("exit", () => this.database.close());
    process.on("SIGHUP", () => process.exit(128 + 1));
    process.on("SIGINT", () => process.exit(128 + 2));
    process.on("SIGTERM", () => process.exit(128 + 15));
  }

  get length() {
    const statement = `SELECT count(key) AS count FROM webstorage;`;
    const result = this.database.prepare(statement).get();
    return result ? result["count"] : 0;
  }

  key(index: number) {
    const statement = `SELECT key FROM webstorage ORDER BY added ASC;`;
    const results = this.database.prepare(statement).all();
    return results && results.length >= index + 1
      ? results[index]["key"]
      : null; // null if index > length, as per spec
  }

  getItem(key: string) {
    const statement = `SELECT value FROM webstorage
      WHERE key=?`;
    const result = this.database.prepare(statement).get(key);
    return result ? result["value"] : undefined;
  }

  setItem(key: string, value: string) {
    const statement = `INSERT OR REPLACE INTO webstorage 
      VALUES (@key, @value, 
        COALESCE(
          (SELECT added FROM webstorage WHERE key=@key), 
          strftime('%s', 'now')
        )
      );`;
    this.database.prepare(statement).run({ key, value });
  }

  removeItem(key: string) {
    const statement = `DELETE FROM webstorage WHERE key=?`;
    this.database.prepare(statement).run(key);
  }

  clear() {
    const statement = `DELETE FROM webstorage`;
    this.database.prepare(statement).run();
  }
}
