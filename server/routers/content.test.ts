import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ listContentItems: vi.fn(), createContentItem: vi.fn(), updateContentItem: vi.fn() }));
vi.mock("../db", () => mocks);

import { contentRouter } from "./content";

const ctx = { user: { id: 11 } } as never;

describe("content workflow", () => {
  it("creates a post with the required status and platform", async () => {
    mocks.createContentItem.mockResolvedValueOnce({ insertId: 1 });
    const caller = contentRouter.createCaller(ctx);
    await caller.create({ title: "Automation hook", body: "Start here", pillar: "AI & Automation", platform: "TikTok", format: "Hook", status: "Idea" });
    expect(mocks.createContentItem).toHaveBeenCalledWith(11, expect.objectContaining({ platform: "TikTok", status: "Idea" }));
  });

  it("updates post status to Published", async () => {
    const caller = contentRouter.createCaller(ctx);
    await caller.update({ id: 4, status: "Published" });
    expect(mocks.updateContentItem).toHaveBeenCalledWith(11, 4, { status: "Published" });
  });
});
