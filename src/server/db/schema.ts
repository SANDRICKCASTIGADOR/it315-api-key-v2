// ~/server/db/schema.ts
import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  text,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `it315_api_key_${name}`);

// API Keys table
export const apiKeys = createTable("api_keys", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  hashedKey: text("hashedKey").notNull(),
  last4: varchar("last4", { length: 4 }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  revoked: boolean("revoked").notNull().default(false),
});

// Motor Specs table - ADD THIS
export const motorSpecs = createTable("motor_specs", {
  id: text("id").primaryKey(),
  apiKeyId: text("api_key_id")
    .notNull()
    .references(() => apiKeys.id, { onDelete: "cascade" }),
  motorName: varchar("motor_name", { length: 256 }).notNull(),
  description: text("description"),
  monthlyPrice: varchar("monthly_price", { length: 50 }),
  fullyPaidPrice: varchar("fully_paid_price", { length: 50 }),
  frontView: text("front_view"),
  sideView: text("side_view"),
  backView: text("back_view"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});