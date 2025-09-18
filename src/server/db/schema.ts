// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `it315-api-key_${name}`);

export const apiKeys = createTable("api_keys", (d) => ({
  // id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  id: d.text("id").primaryKey(),
  imageUrl: d.text("image_url"),
  hashedKey: d.text("hashed_key").notNull(),
  last4: d.varchar("last4", { length: 4 }).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  revoked: d.boolean("revoked").notNull().default(false),
  
  // Specs
  brandname: d.varchar("brandname", { length: 100 }),
  processor: d.varchar("processor", { length: 200 }),
  graphic: d.varchar("graphic", { length: 200 }),
  display: d.varchar("display", { length: 150 }),
  ram: d.varchar("ram", { length: 50 }),
  storage: d.varchar("storage", { length: 100 }),
}));