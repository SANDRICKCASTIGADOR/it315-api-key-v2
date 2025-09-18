// server/db/schema.ts
import { sql } from "drizzle-orm";
import { pgTableCreator, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `it315_api_key_${name}`);

// API Keys table
export const apiKeys = createTable("api_keys", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  hashedKey: text("hashedKey").notNull(),
  last4: varchar("last4", { length: 4 }).notNull(),
  createdAt: timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  revoked: boolean("revoked").notNull().default(false),
});

// Hardware Specs table
export const hardwareSpecs = createTable("hardware_specs", {
  id: text("id").primaryKey(),
  apiKeyId: text("api_key_id")
    .notNull()
    .references(() => apiKeys.id, { onDelete: "cascade" }),
  imageUrl: text("image_url"),
  brandname: varchar("brandname", { length: 100 }),
  processor: varchar("processor", { length: 200 }),
  graphic: varchar("graphic", { length: 200 }),
  display: varchar("display", { length: 150 }),
  ram: varchar("ram", { length: 50 }),
  storage: varchar("storage", { length: 100 }),
  createdAt: timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
