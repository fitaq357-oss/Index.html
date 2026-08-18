import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  invokeLLM: vi.fn(),
  saveResearchReport: vi.fn(),
}));

vi.mock("../_core/llm", () => ({ invokeLLM: mocks.invokeLLM }));
vi.mock("../db", () => ({ saveResearchReport: mocks.saveResearchReport }));

import { aiRouter } from "./ai";

const ctx = { user: { id: 7 } } as never;

describe("AI content workflows", () => {
  it("generates platform content with the bilingual prompt workflow", async () => {
    mocks.invokeLLM.mockResolvedValueOnce({ choices: [{ message: { content: "Aaj AI workflow ko simple banate hain." } }] });
    const caller = aiRouter.createCaller(ctx);
    const result = await caller.generate({
      pillar: "AI & Automation",
      platform: "Instagram",
      format: "Caption",
      topic: "AI onboarding workflow",
      audience: "Freelancers",
      tone: "Helpful",
      style: "Natural everyday voice",
    });
    expect(result.content).toContain("AI workflow");
    expect(mocks.invokeLLM).toHaveBeenCalledWith(expect.objectContaining({ model: "gpt-5-mini" }));
    expect(mocks.invokeLLM.mock.calls[0]?.[0].messages[1].content).toContain("Roman Urdu");
  });

  it("saves a research report against the selected pillar", async () => {
    mocks.invokeLLM.mockResolvedValueOnce({ choices: [{ message: { content: "## Topic Opportunities\n- Useful direction" } }] });
    const caller = aiRouter.createCaller(ctx);
    await caller.research({ pillar: "Freelance Business", audience: "New freelancers", focus: "Client systems" });
    expect(mocks.saveResearchReport).toHaveBeenCalledWith(7, expect.objectContaining({ pillar: "Freelance Business", audience: "New freelancers" }));
  });
});
