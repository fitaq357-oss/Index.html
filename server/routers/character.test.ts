import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  listCharacterProfiles: vi.fn(),
  createCharacterProfile: vi.fn(),
  updateCharacterProfile: vi.fn(),
  setDefaultCharacterProfile: vi.fn(),
  deleteCharacterProfile: vi.fn(),
}));
vi.mock("../db", () => mocks);

import { characterRouter } from "./character";

const ctx = { user: { id: 31 } } as never;
const profile = { name: "Ayaan", identitySummary: "A calm South Asian male social media manager.", appearance: "Short black hair, trimmed beard and warm-brown skin.", wardrobe: "Charcoal overshirt and plain t-shirt.", voiceName: "Charon", voiceoverDirection: "Clear friendly male Roman Urdu-English narration." };

describe("character library workflow", () => {
  it("creates a reusable profile with a selected voice", async () => {
    mocks.createCharacterProfile.mockResolvedValueOnce(9);
    mocks.listCharacterProfiles.mockResolvedValueOnce([{ id: 9 }]);
    const caller = characterRouter.createCaller(ctx);
    const result = await caller.create(profile);
    expect(result).toEqual({ id: 9 });
    expect(mocks.createCharacterProfile).toHaveBeenCalledWith(31, expect.objectContaining({ name: "Ayaan", voiceName: "Charon" }));
    expect(mocks.setDefaultCharacterProfile).toHaveBeenCalledWith(31, 9);
  });

  it("updates the selected default character profile", async () => {
    const caller = characterRouter.createCaller(ctx);
    await caller.setDefault({ id: 4 });
    expect(mocks.setDefaultCharacterProfile).toHaveBeenCalledWith(31, 4);
  });
});
