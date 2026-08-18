import type { ContentFormat, ContentPillar, ContentPlatform } from "../shared/contentConfig";

type ContentPromptInput = {
  pillar: ContentPillar;
  platform: ContentPlatform;
  format: ContentFormat;
  topic: string;
  audience: string;
  tone: string;
  style: string;
  brief?: string;
};

export function buildContentPrompt(input: ContentPromptInput) {
  return `Create a high-quality ${input.format} for ${input.platform}.

Content pillar: ${input.pillar}
Topic: ${input.topic}
Audience: ${input.audience}
Tone: ${input.tone}
Writing style: ${input.style}
Additional brief: ${input.brief || "No extra brief provided."}

Output rules:
- Write in a natural Urdu-English mix using Roman Urdu for Urdu phrases and English for industry terms.
- Do not write an English-only response.
- Follow the requested tone and writing style closely; it should sound like a real creator, not a generic AI template.
- Use conversational rhythm, concrete language and varied sentence length. Avoid generic motivational filler, forced emojis, and robotic transitions.
- Make the opening immediately useful and specific.
- Match the requested ${input.platform} platform and ${input.format} format.
- Return the finished content only, with clean line breaks and no explanation about your process.`;
}

type ResearchPromptInput = {
  pillar: ContentPillar;
  audience: string;
  focus?: string;
};

export function buildResearchPrompt(input: ResearchPromptInput) {
  return `You are a content strategist helping a creator who writes in Urdu-English mix for a South Asian audience.

Research pillar: ${input.pillar}
Target audience: ${input.audience}
Focus: ${input.focus || "Find useful, current-looking directions across beginner to advanced levels."}

Create a practical research brief in Urdu-English mix using Roman Urdu for Urdu phrases. Include these sections exactly:
1. Topic Opportunities — 5 specific topics with a short angle.
2. Trend Directions — 4 durable or emerging directions, clearly phrased as directions rather than verified real-time facts.
3. Keyword Suggestions — 12 search-friendly phrases.
4. Content Hooks — 6 short hook ideas.
5. Best Next Move — one clear recommendation for the coming week.

Avoid claiming live statistics or breaking news. Keep every suggestion actionable for YouTube, Instagram, TikTok, Facebook, and LinkedIn.`;
}
