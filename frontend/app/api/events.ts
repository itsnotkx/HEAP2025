// _apis/apis.ts
import { RawEvent } from "../../types/event";

export async function fetchAllEvents(): Promise<RawEvent[]> {
  const res = await fetch("http://localhost:8000/api/events");

  if (!res.ok) throw new Error("Failed to fetch events");

  return res.json();
}

export async function fetchFilteredEvents({
  date,
  startTime,
  endTime,
}: {
  date: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:MM'
  endTime: string; // 'HH:MM'
}) {
  // Format date and times as needed by your backend
  const startDate = `${date.toString()}T${startTime.toString()}:00`;
  const endDate = `${date.toString()}T${endTime.toString()}:00`;

  // This assumes you have a GET /events/search endpoint
  const res = await fetch(
    `http://localhost:8000/api/events/search?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}&user_id=1`,
  );

  if (!res.ok) throw new Error("Failed to fetch events");

  return res.json();
}
