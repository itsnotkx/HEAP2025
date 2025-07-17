/*
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
  */

import { notFound } from "next/navigation";

import { fetchEventById } from "../../api/apis";

import EventDetail from "@/components/eventDetail";

export default async function EventPage({
  params,
}: {
  params: { eventid: string };
}) {
  console.log("[EventPage] Params from route:", params);

  try {
    const awaitedParams = await params; // not needed unless params is async
    const eventId = Number(awaitedParams.eventid);

    console.log("[EventPage] Parsed event ID:", eventId);

    if (isNaN(eventId)) {
      console.error("[EventPage] Invalid event ID in route");
      throw new Error("Invalid event ID");
    }

    const event = await fetchEventById(eventId);

    console.log("[EventPage] Event data:", event);

    if (!event) {
      console.warn("[EventPage] No event returned by backend");

      return notFound(); // triggers 404
    }

    return <EventDetail event={event} />;
  } catch (error) {
    console.error("[EventPage] Error loading event:", error);

    return notFound(); // or render a fallback/500 page
  }
}
