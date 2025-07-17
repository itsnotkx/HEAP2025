import { notFound } from "next/navigation";
import EventDetail from "@/components/eventDetail";
import { fetchEventById } from "../../api/apis";

export interface EventPageProps {
  params: Promise<{ eventid: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const awaitedParams = await params;
  const eventId = Number(awaitedParams.eventid);

  if (isNaN(eventId)) {
    return notFound();
  }

  const event = await fetchEventById(eventId);
  if (!event) return notFound();

  return <EventDetail event={event} />;
}
