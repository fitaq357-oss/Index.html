import { z } from "zod";
import { createCharacterProfile, deleteCharacterProfile, listCharacterProfiles, setDefaultCharacterProfile, updateCharacterProfile } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

const characterInput = z.object({
  name: z.string().trim().min(2).max(120),
  identitySummary: z.string().trim().min(10).max(700),
  appearance: z.string().trim().min(10).max(900),
  wardrobe: z.string().trim().min(5).max(500),
  voiceName: z.string().trim().min(2).max(80),
  voiceoverDirection: z.string().trim().min(10).max(600),
});

export const characterRouter = router({
  list: protectedProcedure.query(({ ctx }) => listCharacterProfiles(ctx.user.id)),
  create: protectedProcedure.input(characterInput).mutation(async ({ ctx, input }) => {
    const id = await createCharacterProfile(ctx.user.id, input);
    const profiles = await listCharacterProfiles(ctx.user.id);
    if (profiles.length === 1) await setDefaultCharacterProfile(ctx.user.id, id);
    return { id };
  }),
  update: protectedProcedure.input(characterInput.extend({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const { id, ...profile } = input;
    await updateCharacterProfile(ctx.user.id, id, profile);
    return { success: true };
  }),
  setDefault: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    await setDefaultCharacterProfile(ctx.user.id, input.id);
    return { success: true };
  }),
  remove: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    await deleteCharacterProfile(ctx.user.id, input.id);
    return { success: true };
  }),
});
