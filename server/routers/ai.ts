import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { saveResearchReport } from "../db";
import { buildContentPrompt, buildResearchPrompt } from "../contentPrompts";
import { router, protectedProcedure } from "../_core/trpc";
import { CONTENT_FORMATS, CONTENT_PILLARS, CONTENT_PLATFORMS } from "../../shared/contentConfig";

function responseText(response: Awaited<ReturnType<typeof invokeLLM>>) {
  const text = response.choices[0]?.message?.content;
  if (!text || typeof text !== "string") throw new Error("AI response was empty. Please try again.");
  return text;
}

export const aiRouter = router({
  research: protectedProcedure.input(z.object({
    pillar: z.enum(CONTENT_PILLARS),
    audience: z.string().trim().min(3).max(400),
    focus: z.string().trim().max(600).optional(),
  })).mutation(async ({ ctx, input }) => {
    const response = await invokeLLM({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: "You are a precise content research assistant. Follow the requested headings and never invent live data." },
        { role: "user", content: buildResearchPrompt(input) },
      ],
    });
    const report = responseText(response);
    await saveResearchReport(ctx.user.id, { ...input, report });
    return { report };
  }),
  generate: protectedProcedure.input(z.object({
    pillar: z.enum(CONTENT_PILLARS),
    platform: z.enum(CONTENT_PLATFORMS),
    format: z.enum(CONTENT_FORMATS),
    topic: z.string().trim().min(3).max(500),
    audience: z.string().trim().min(3).max(400),
    tone: z.string().trim().min(3).max(100),
    brief: z.string().trim().max(1000).optional(),
  })).mutation(async ({ input }) => {
    const response = await invokeLLM({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: "You write platform-native content for a bilingual creator. Honor language and format constraints exactly." },
        { role: "user", content: buildContentPrompt(input) },
      ],
    });
    return { content: responseText(response) };
  }),
});
