import { getEvents } from "@/utils/server/getEvents";
import { extractStartEndTimes, generateTimeSlots } from "@/utils/timeSlots";
import TimelineClient from "./TimelineClient";
import { Event } from "@/components/eventCard";

export default async function TimelinePage() {
  // Fetch all webscrapped events
  const events: Event[] = await getEvents();

  // Compute dynamic slots
  const { start, end } = extractStartEndTimes(events);
  const timeSlots = generateTimeSlots(start, end);

  return <TimelineClient events={events} timeSlots={timeSlots} />;
}
