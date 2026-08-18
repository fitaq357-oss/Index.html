import { z } from "zod";
import { getStrategy, saveStrategy } from "../db";
import { router, protectedProcedure } from "../_core/trpc";
import { CONTENT_PILLARS, CONTENT_PLATFORMS } from "../../shared/contentConfig";

const strategyInput = z.object({
  targetAudience: z.string().trim().min(3).max(800),
  pillarSubtopics: z.array(z.object({
    pillar: z.enum(CONTENT_PILLARS),
    subtopics: z.array(z.string().trim().min(2).max(120)).min(1).max(20),
  })).length(CONTENT_PILLARS.length),
  postingGoals: z.array(z.object({
    platform: z.enum(CONTENT_PLATFORMS),
    weeklyPosts: z.number().int().min(0).max(21),
  })).min(1).max(5),
});

type PillarSubtopics = Array<{ pillar: (typeof CONTENT_PILLARS)[number]; subtopics: string[] }>;

function parsePillarSubtopics(value: string): PillarSubtopics {
  const parsed = JSON.parse(value) as unknown;
  if (Array.isArray(parsed) && parsed.every((item) => typeof item === "object" && item !== null && "pillar" in item && "subtopics" in item)) {
    return parsed as PillarSubtopics;
  }
  const legacyTopics = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  return CONTENT_PILLARS.map((pillar, index) => ({ pillar, subtopics: index === 0 && legacyTopics.length ? legacyTopics : ["Practical workflows"] }));
}

export const strategyRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const strategy = await getStrategy(ctx.user.id);
    if (!strategy) return null;
    return {
      ...strategy,
      pillarSubtopics: parsePillarSubtopics(strategy.subtopics),
      postingGoals: JSON.parse(strategy.postingGoals) as Array<{ platform: string; weeklyPosts: number }>,
    };
  }),
  save: protectedProcedure.input(strategyInput).mutation(async ({ ctx, input }) => {
    await saveStrategy(ctx.user.id, {
      targetAudience: input.targetAudience,
      subtopics: input.pillarSubtopics,
      postingGoals: input.postingGoals,
    });
    return { success: true };
  }),
});
