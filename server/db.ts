import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { characterProfiles, contentItems, contentStrategies, InsertUser, researchReports, users } from "../drizzle/schema";
import type { ContentFormat, ContentPillar, ContentPlatform, ContentStatus } from "../shared/contentConfig";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

async function requireDb() { const db = await getDb(); if (!db) throw new Error("Database is not available."); return db; }

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) return;
  const values: InsertUser = { openId: user.openId, lastSignedIn: new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  (["name", "email", "loginMethod"] as const).forEach((field) => { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } });
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user"); updateSet.role = values.role;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0]; }

type ContentFilters = { pillar?: ContentPillar; platform?: ContentPlatform; status?: ContentStatus };
export async function listContentItems(userId: number, filters: ContentFilters = {}) {
  const db = await requireDb(); const conditions = [eq(contentItems.userId, userId)];
  if (filters.pillar) conditions.push(eq(contentItems.pillar, filters.pillar)); if (filters.platform) conditions.push(eq(contentItems.platform, filters.platform)); if (filters.status) conditions.push(eq(contentItems.status, filters.status));
  return db.select().from(contentItems).where(and(...conditions)).orderBy(desc(contentItems.updatedAt));
}

export async function createContentItem(userId: number, item: { title: string; body: string; pillar: ContentPillar; platform: ContentPlatform; format: ContentFormat; status: ContentStatus; scheduledAt?: Date | null }) { const db = await requireDb(); const result = await db.insert(contentItems).values({ userId, ...item }); return result[0]; }
export async function updateContentItem(userId: number, id: number, changes: { title?: string; body?: string; pillar?: ContentPillar; platform?: ContentPlatform; format?: ContentFormat; status?: ContentStatus; scheduledAt?: Date | null }) { const db = await requireDb(); const values = Object.fromEntries(Object.entries(changes).filter(([, value]) => value !== undefined)); if (Object.keys(values).length === 0) return; await db.update(contentItems).set(values).where(and(eq(contentItems.id, id), eq(contentItems.userId, userId))); }

export async function saveStrategy(userId: number, strategy: { targetAudience: string; subtopics: Array<{ pillar: ContentPillar; subtopics: string[] }>; postingGoals: Array<{ platform: ContentPlatform; weeklyPosts: number }> }) {
  const db = await requireDb(); const values = { userId, targetAudience: strategy.targetAudience, subtopics: JSON.stringify(strategy.subtopics), postingGoals: JSON.stringify(strategy.postingGoals) };
  await db.insert(contentStrategies).values(values).onDuplicateKeyUpdate({ set: { ...values, updatedAt: new Date() } });
}
export async function getStrategy(userId: number) { const db = await requireDb(); const result = await db.select().from(contentStrategies).where(eq(contentStrategies.userId, userId)).limit(1); return result[0]; }
export async function saveCharacterProfile(userId: number, profile: { name: string; identitySummary: string; appearance: string; wardrobe: string; voiceoverDirection: string }) {
  const db = await requireDb(); const values = { userId, ...profile };
  await db.insert(characterProfiles).values(values).onDuplicateKeyUpdate({ set: { ...values, updatedAt: new Date() } });
}
export async function getCharacterProfile(userId: number) { const db = await requireDb(); const result = await db.select().from(characterProfiles).where(eq(characterProfiles.userId, userId)).limit(1); return result[0]; }
export async function saveResearchReport(userId: number, report: { pillar: ContentPillar; audience: string; focus?: string; report: string }) { const db = await requireDb(); await db.insert(researchReports).values({ userId, ...report }); }
export async function listResearchReports(userId: number) { const db = await requireDb(); return db.select().from(researchReports).where(eq(researchReports.userId, userId)).orderBy(desc(researchReports.createdAt)); }
