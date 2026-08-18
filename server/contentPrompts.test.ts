import { describe, expect, it } from "vitest";
import { CONTENT_PILLARS, CONTENT_PLATFORMS, CONTENT_STATUSES } from "../shared/contentConfig";
import { buildContentPrompt, buildResearchPrompt } from "./contentPrompts";

describe("content platform configuration", () => {
  it("uses the required pillars, platforms, and post statuses", () => {
    expect(CONTENT_PILLARS).toEqual(["AI & Automation", "Social Media Management", "Content Pipeline", "Freelance Business"]);
    expect(CONTENT_PLATFORMS).toEqual(["YouTube", "Instagram", "TikTok", "Facebook", "LinkedIn"]);
    expect(CONTENT_STATUSES).toEqual(["Idea", "Draft", "Ready", "Published"]);
  });
});

describe("AI prompt builders", () => {
  it("requires Roman Urdu and English mix in generated content", () => {
    const prompt = buildContentPrompt({
      pillar: "AI & Automation",
      platform: "Instagram",
      format: "Caption",
      topic: "AI workflow for freelancers",
      audience: "Freelancers learning AI",
      tone: "Helpful",
    });
    expect(prompt).toContain("Roman Urdu");
    expect(prompt).toContain("Do not write an English-only response.");
  });

  it("does not present trend directions as verified real-time facts", () => {
    const prompt = buildResearchPrompt({ pillar: "Content Pipeline", audience: "Freelance creators" });
    expect(prompt).toContain("directions rather than verified real-time facts");
  });
});

