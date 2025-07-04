import { Event } from "@/components/eventCard";

// Defensive time parsing
export function parseTimeToMinutes(timeStr: string | undefined | null): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(" ");
  if (parts.length < 2) return 0;
  const [time, modifier] = parts;
  let [hours, minutes] = time.split(":").map(Number);
  if (isNaN(hours)) hours = 0;
  if (isNaN(minutes)) minutes = 0;
  if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
  return hours * 60 + (minutes || 0);
}

export function formatMinutesToTimeLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${suffix}`;
}

export function extractStartEndTimes(events: Event[]): { start: number; end: number } {
  let minStart = 24 * 60;
  let maxEnd = 0;
  events.forEach((ev) => {
    if (!ev.Time || !ev.Time.includes("-")) return;
    const [startStr, endStr] = ev.Time.split("-").map((s) => s.trim());
    const start = parseTimeToMinutes(startStr);
    const end = parseTimeToMinutes(endStr);
    if (start < minStart) minStart = start;
    if (end > maxEnd) maxEnd = end;
  });
  // If no valid times found, default to 9am-5pm
  if (minStart === 24 * 60 || maxEnd === 0) {
    minStart = 9 * 60;
    maxEnd = 17 * 60;
  }
  minStart = Math.max(0, minStart - 30);
  maxEnd = Math.min(24 * 60, maxEnd + 30);
  return { start: minStart, end: maxEnd };
}

export function generateTimeSlots(
  startMinutes: number,
  endMinutes: number,
  interval: number = 30
): string[] {
  const slots: string[] = [];
  for (let time = startMinutes; time <= endMinutes; time += interval) {
    slots.push(formatMinutesToTimeLabel(time));
  }
  return slots;
}
