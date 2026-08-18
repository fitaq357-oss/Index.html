import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ saveStrategy: vi.fn(), getStrategy: vi.fn() }));
vi.mock("../db", () => mocks);

import { strategyRouter } from "./strategy";

const ctx = { user: { id: 22 } } as never;
const pillarSubtopics = [
  { pillar: "AI & Automation" as const, subtopics: ["AI systems"] },
  { pillar: "Social Media Management" as const, subtopics: ["Client delivery"] },
  { pillar: "Content Pipeline" as const, subtopics: ["Repurposing"] },
  { pillar: "Freelance Business" as const, subtopics: ["Pricing"] },
];

describe("strategy workflow", () => {
  it("saves a separate sub-topic collection for each fixed pillar", async () => {
    const caller = strategyRouter.createCaller(ctx);
    await caller.save({
      targetAudience: "Creators and freelancers",
      pillarSubtopics,
      postingGoals: [{ platform: "YouTube", weeklyPosts: 1 }],
    });
    expect(mocks.saveStrategy).toHaveBeenCalledWith(22, expect.objectContaining({ subtopics: pillarSubtopics }));
  });
});
