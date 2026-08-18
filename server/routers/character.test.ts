import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ saveCharacterProfile: vi.fn(), getCharacterProfile: vi.fn() }));
vi.mock("../db", () => mocks);

import { characterRouter } from "./character";

const ctx = { user: { id: 31 } } as never;

describe("character profile workflow", () => {
  it("saves a reusable character and voiceover direction", async () => {
    const caller = characterRouter.createCaller(ctx);
    await caller.save({
      name: "Ayaan",
      identitySummary: "A calm South Asian male social media manager.",
      appearance: "Short black hair, trimmed beard and warm-brown skin.",
      wardrobe: "Charcoal overshirt and plain t-shirt.",
      voiceoverDirection: "Clear friendly male Roman Urdu-English narration.",
    });
    expect(mocks.saveCharacterProfile).toHaveBeenCalledWith(31, expect.objectContaining({ name: "Ayaan", voiceoverDirection: expect.stringContaining("Roman Urdu") }));
  });
});
