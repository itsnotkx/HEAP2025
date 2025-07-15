import { notFound } from "next/navigation";
import EventDetail from "@/components/eventDetail"; // Your detail component
import { fetchEventById } from "../../api/apis";




  export default async function EventPage({ params }: { params: { eventid: string } }) {
  console.log('Params from route:', params);
  const awaitedParams = await params; // Await the params object
  const eventId = Number(awaitedParams.eventid);

  if (isNaN(eventId)) throw new Error("Invalid event ID");

  const event = await fetchEventById(eventId);
  if (!event) return notFound();

  return <EventDetail event={event} />;
}