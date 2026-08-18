export const CONTENT_PILLARS = [
  "AI & Automation",
  "Social Media Management",
  "Content Pipeline",
  "Freelance Business",
] as const;

export const CONTENT_PLATFORMS = [
  "YouTube",
  "Instagram",
  "TikTok",
  "Facebook",
  "LinkedIn",
] as const;

export const CONTENT_STATUSES = ["Idea", "Draft", "Ready", "Published"] as const;

export const CONTENT_FORMATS = ["Caption", "Hook", "Script", "Post Copy"] as const;

export type ContentPillar = (typeof CONTENT_PILLARS)[number];
export type ContentPlatform = (typeof CONTENT_PLATFORMS)[number];
export type ContentStatus = (typeof CONTENT_STATUSES)[number];
export type ContentFormat = (typeof CONTENT_FORMATS)[number];

export const PILLAR_DESCRIPTIONS: Record<ContentPillar, string> = {
  "AI & Automation": "Practical AI systems, tools, workflows, and skill-building.",
  "Social Media Management": "Strategy, execution, growth, and client-ready social systems.",
  "Content Pipeline": "Ideas to publishing: repeatable content processes that save time.",
  "Freelance Business": "Positioning, client work, pricing, delivery, and sustainable growth.",
};
