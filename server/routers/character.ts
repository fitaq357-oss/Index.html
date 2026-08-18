import { z } from "zod";
import { getCharacterProfile, saveCharacterProfile } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

const characterInput = z.object({
  name: z.string().trim().min(2).max(120),
  identitySummary: z.string().trim().min(10).max(700),
  appearance: z.string().trim().min(10).max(900),
  wardrobe: z.string().trim().min(5).max(500),
  voiceoverDirection: z.string().trim().min(10).max(600),
});

export const characterRouter = router({
  get: protectedProcedure.query(({ ctx }) => getCharacterProfile(ctx.user.id)),
  save: protectedProcedure.input(characterInput).mutation(async ({ ctx, input }) => {
    await saveCharacterProfile(ctx.user.id, input);
    return { success: true };
  }),
});
