import { z } from "zod";
import { createContentItem, listContentItems, updateContentItem } from "../db";
import { router, protectedProcedure } from "../_core/trpc";
import { CONTENT_FORMATS, CONTENT_PILLARS, CONTENT_PLATFORMS, CONTENT_STATUSES } from "../../shared/contentConfig";

const contentInput = z.object({
  title: z.string().trim().min(3).max(240),
  body: z.string().trim().min(1).max(50000),
  pillar: z.enum(CONTENT_PILLARS),
  platform: z.enum(CONTENT_PLATFORMS),
  format: z.enum(CONTENT_FORMATS),
  status: z.enum(CONTENT_STATUSES).default("Idea"),
  scheduledAt: z.coerce.date().nullable().optional(),
});

export const contentRouter = router({
  list: protectedProcedure.input(z.object({
    pillar: z.enum(CONTENT_PILLARS).optional(),
    platform: z.enum(CONTENT_PLATFORMS).optional(),
    status: z.enum(CONTENT_STATUSES).optional(),
  }).optional()).query(({ ctx, input }) => listContentItems(ctx.user.id, input)),
  overview: protectedProcedure.query(async ({ ctx }) => {
    const items = await listContentItems(ctx.user.id);
    return {
      total: items.length,
      ideas: items.filter((item) => item.status === "Idea").length,
      drafts: items.filter((item) => item.status === "Draft").length,
      ready: items.filter((item) => item.status === "Ready").length,
      published: items.filter((item) => item.status === "Published").length,
      scheduled: items.filter((item) => item.scheduledAt && item.scheduledAt > new Date()).length,
    };
  }),
  create: protectedProcedure.input(contentInput).mutation(({ ctx, input }) => createContentItem(ctx.user.id, input)),
  update: protectedProcedure.input(contentInput.partial().extend({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const { id, ...changes } = input;
    await updateContentItem(ctx.user.id, id, changes);
    return { success: true };
  }),
});
