"use client";
import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import Link from "next/link";

export interface Event {
  id: string;
  title: string;
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
  className?: string;
}

export default function EventCard({ event, className = "" }: EventCardProps) {
  // Remove leading numbers and dot from title for display
  const displayTitle = event.title.replace(/^\d+\.\s*/, "");

  return (
    <Link href={`/events/${event.id}`} passHref>
      <Card
        isPressable
        isHoverable
        className={`flex flex-col h-full w-full transition-transform hover:scale-105 shadow rounded-lg bg-white ${className}`}
      >
        {event["Image URL(s)"]?.[0] && (
          <Image
            src={event["Image URL(s)"][0]}
            alt={displayTitle}
            className="h-40 w-full object-cover"
            height={160}
            width="100%"
          />
        )}
        <CardBody className="flex-1 flex flex-col p-4">
          <h3 className="font-bold text-lg mb-1">{displayTitle}</h3>
          <p className="text-gray-500 text-sm line-clamp-3">
            {event.Description}
          </p>
        </CardBody>
        <CardFooter className="mt-auto flex justify-between p-4 text-xs text-gray-400">
          <span>{event["Address / Location"]}</span>
          <span>{event.Time}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
