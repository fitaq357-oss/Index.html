import { describe, expect, it } from "vitest";
import { CONTENT_PILLARS, CONTENT_PLATFORMS, CONTENT_STATUSES } from "../shared/contentConfig";
import { buildContentPrompt, buildReelPrompt, buildResearchPrompt } from "./contentPrompts";

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
      style: "Natural everyday voice",
    });
    expect(prompt).toContain("Roman Urdu");
    expect(prompt).toContain("Do not write an English-only response.");
    expect(prompt).toContain("Writing style: Natural everyday voice");
    expect(prompt).toContain("real creator");
  });

  it("does not present trend directions as verified real-time facts", () => {
    const prompt = buildResearchPrompt({ pillar: "Content Pipeline", audience: "Freelance creators" });
    expect(prompt).toContain("directions rather than verified real-time facts");
  });

  it("creates a Roman Urdu-English reel production prompt", () => {
    const prompt = buildReelPrompt({
      pillar: "Social Media Management",
      topic: "Simple content system",
      duration: "30 seconds",
      style: "Cinematic educational",
      audience: "Freelancers",
      characterProfile: "Name: Ayaan. Appearance: short black hair and trimmed beard.",
      voiceoverDirection: "Clear confident male narration.",
    });
    expect(prompt).toContain("Voiceover Script");
    expect(prompt).toContain("Roman Urdu mix");
    expect(prompt).toContain("Name: Ayaan");
    expect(prompt).toContain("Voiceover Direction");
  });
});
