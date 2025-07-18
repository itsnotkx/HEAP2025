
import { RawEvent } from "../../types/event";

const BASE_URL =
  process.env.EVENTS_API_BASE_ENDPOINT;

export async function fetchAllEvents(): Promise<RawEvent[]> {
  const res = await fetch(`${BASE_URL}/`);

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
  const startDate = `${date}T${startTime}:00`;
  const endDate = `${date}T${endTime}:00`;

  const url = `${BASE_URL}/search?start_date=${encodeURIComponent(
    startDate,
  )}&end_date=${encodeURIComponent(endDate)}&user_id=1`;

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch events");

  return res.json();
}
