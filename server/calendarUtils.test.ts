import { describe, expect, it } from "vitest";
import { getCalendarDays, mondayOf, shiftCalendarFocus } from "../shared/calendarUtils";

describe("calendar week utilities", () => {
  it("starts a weekly view on Monday and includes seven days", () => {
    const days = getCalendarDays(new Date(2026, 7, 19), "Week");
    expect(days).toHaveLength(7);
    expect(days[0]).toEqual(mondayOf(new Date(2026, 7, 19)));
    expect(days[6]?.getDay()).toBe(0);
  });

  it("moves weekly focus by exactly seven days", () => {
    const initial = new Date(2026, 7, 19);
    const next = shiftCalendarFocus(initial, "Week", 1);
    const previous = shiftCalendarFocus(initial, "Week", -1);
    expect(next.getDate() - initial.getDate()).toBe(7);
    expect(previous.getDate() - initial.getDate()).toBe(-7);
  });
});
