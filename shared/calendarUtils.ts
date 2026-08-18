export type CalendarView = "Month" | "Week";

export function mondayOf(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() - ((result.getDay() + 6) % 7));
  return result;
}

export function getCalendarDays(focusDate: Date, view: CalendarView) {
  const start = view === "Month" ? new Date(focusDate.getFullYear(), focusDate.getMonth(), 1) : mondayOf(focusDate);
  if (view === "Month") start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const count = view === "Month" ? 42 : 7;
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export function shiftCalendarFocus(date: Date, view: CalendarView, direction: -1 | 1) {
  const next = new Date(date);
  if (view === "Month") next.setMonth(next.getMonth() + direction);
  else next.setDate(next.getDate() + direction * 7);
  return next;
}
