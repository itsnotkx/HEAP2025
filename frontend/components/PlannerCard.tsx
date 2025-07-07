// components/eventCard.tsx
import { Event } from "../types/event";

interface EventCardProps {
  event: Event;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className }) => (
  <div className={className}>
    <h2>{event.title}</h2>
    <p>
      <strong>Date:</strong>{" "}
      {event.startDate ? new Date(event.startDate).toLocaleDateString() : "TBA"} –{" "}
      {event.endDate ? new Date(event.endDate).toLocaleDateString() : "TBA"}
    </p>
    <p>
      <strong>Price:</strong> {event.price || "TBA"}
    </p>
    <p>
      <strong>Address:</strong> {event.address || "TBA"}
    </p>
    <p>{event.description || "No description available."}</p>
  </div>
);

export default EventCard;
