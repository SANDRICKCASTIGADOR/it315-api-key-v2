// Check your schema.ts file - make sure it looks like this:
import { sql } from "drizzle-orm";
import { index, pgTableCreator, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `it315-api-key_${name}`);

export const apiKeys = createTable("api_keys", (d) => ({
  id: d.text("id").primaryKey(),
  imageUrl: d.text("image_url"), // Note: snake_case in DB, camelCase in TypeScript
  hashedKey: d.text("hashed_key").notNull(),
  last4: d.varchar("last4", { length: 4 }).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  revoked: d.boolean("revoked").notNull().default(false),
  
  // Hardware specifications
  brandname: d.varchar("brandname", { length: 100 }),
  processor: d.varchar("processor", { length: 200 }),
  graphic: d.varchar("graphic", { length: 200 }),
  display: d.varchar("display", { length: 150 }),
  ram: d.varchar("ram", { length: 50 }),
  storage: d.varchar("storage", { length: 100 }),
}));