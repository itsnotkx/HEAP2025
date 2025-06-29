
"use client";
// components/EventCard.tsx
import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import Link from "next/link";

export interface Event {
  id: string; // or number, depending on your data
  Title: string;
  "Start Date": string | null;
  "End Date": string | null;
  Time: string | null;
  "Address / Location": string | null;
  "Postal Code": string | null;
  Category: string | null;
  "Price / Ticket Info": string | null;
  Description: string;
  "Image URL(s)": string[];
  Organizer: string | null;
  "Official Event Link": string | null;
  url: string[];
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`} passHref>
      <Card 
        isPressable 
        isHoverable 
        className="m-4 transition-transform hover:scale-105 "
      >
        <CardBody className="p-0 overflow-hidden">
          {event["Image URL(s)"]?.[0] && (
            <Image
              src={event["Image URL(s)"][0]}
              alt={event.Title}
              className="w-full object-cover"
              height={200}
              width="100%"
            />
          )}
          <div className="p-4">
            <h3 className="font-bold text-lg">{event.Title}</h3>
            <p className="text-gray-500 truncate">
              {event.Description.substring(0, 100)}...
            </p>
          </div>
        </CardBody>
        <CardFooter className="flex justify-between">
          <span>{event["Address / Location"]}</span>
          <span>{event.Time}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}