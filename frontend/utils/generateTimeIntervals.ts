// utils/generateTimeIntervals.ts
export function generateTimeIntervals(
  startTime: string, // e.g. "09:00"
  endTime: string,   // e.g. "17:00"
  intervalMinutes: number // e.g. 15, 30, 45
): string[] {
  const pad = (num: number) => num.toString().padStart(2, "0");
  const to12Hour = (h: number, m: number) => {
    const hour = h % 12 === 0 ? 12 : h % 12;
    const suffix = h < 12 || h === 24 ? "AM" : "PM";
    return `${hour}:${pad(m)} ${suffix}`;
  };
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const slots: string[] = [];
  let h = startHour, m = startMinute;
  while (h < endHour || (h === endHour && m <= endMinute)) {
    slots.push(to12Hour(h, m));
    m += intervalMinutes;
    if (m >= 60) {
      h += Math.floor(m / 60);
      m %= 60;
    }
  }
  return slots;
}
