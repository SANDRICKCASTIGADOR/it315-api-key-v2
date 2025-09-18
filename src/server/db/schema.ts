// server/db/schema.ts
import { sql } from "drizzle-orm";
import { pgTableCreator, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `it315-api-key_${name}`);

// Original API Keys table
export const apiKeys = createTable("api_keys", (d) => ({
  id: d.text("id").primaryKey(),
  name: d.varchar({ length: 256 }).notNull(),
  hashedKey: d.text("hashed_key").notNull(),
  last4: d.varchar("last4", { length: 4 }).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  revoked: d.boolean("revoked").notNull().default(false),
}));

// New Hardware Specifications table
export const hardwareSpecs = createTable("hardware_specs", (d) => ({
  id: d.text("id").primaryKey(),
  apiKeyId: d.text("api_key_id").notNull().references(() => apiKeys.id, { onDelete: "cascade" }),
  imageUrl: d.text("image_url"),
  brandname: d.varchar("brandname", { length: 100 }),
  processor: d.varchar("processor", { length: 200 }),
  graphic: d.varchar("graphic", { length: 200 }),
  display: d.varchar("display", { length: 150 }),
  ram: d.varchar("ram", { length: 50 }),
  storage: d.varchar("storage", { length: 100 }),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));