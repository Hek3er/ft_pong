import type { FastifyInstance } from "fastify";

export const initDatabase = async (server: FastifyInstance) => {
  try {
    await server.db.run(
      `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            email_verified BOOLEAN DEFAULT 0,
            password TEXT NOT NULL,
            status TEXT CHECK(status IN ('online', 'offline','in-game')) DEFAULT 'offline',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`
    );
  } catch (err) {
    console.error("Coudn't create table");
  }
};
