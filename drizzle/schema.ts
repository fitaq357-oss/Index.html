import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { CONTENT_FORMATS, CONTENT_PILLARS, CONTENT_PLATFORMS, CONTENT_STATUSES } from "../shared/contentConfig";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const contentStrategies = mysqlTable(
  "contentStrategies",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
    targetAudience: text("targetAudience").notNull(),
    subtopics: text("subtopics").notNull(),
    postingGoals: text("postingGoals").notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("contentStrategies_userId_idx").on(table.userId)],
);

export const contentItems = mysqlTable(
  "contentItems",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 240 }).notNull(),
    body: text("body").notNull(),
    pillar: mysqlEnum("pillar", CONTENT_PILLARS).notNull(),
    platform: mysqlEnum("platform", CONTENT_PLATFORMS).notNull(),
    format: mysqlEnum("format", CONTENT_FORMATS).notNull(),
    status: mysqlEnum("status", CONTENT_STATUSES).default("Idea").notNull(),
    scheduledAt: timestamp("scheduledAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("contentItems_userId_idx").on(table.userId),
    index("contentItems_schedule_idx").on(table.userId, table.scheduledAt),
  ],
);

export const researchReports = mysqlTable(
  "researchReports",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    pillar: mysqlEnum("pillar", CONTENT_PILLARS).notNull(),
    audience: varchar("audience", { length: 240 }).notNull(),
    focus: text("focus"),
    report: text("report").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("researchReports_userId_idx").on(table.userId)],
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type ContentItem = typeof contentItems.$inferSelect;
export type ContentStrategy = typeof contentStrategies.$inferSelect;
export type ResearchReport = typeof researchReports.$inferSelect;
