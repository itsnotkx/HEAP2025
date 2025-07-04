"use client";
import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";

export interface Event {
  id: string | number;
  Title: string;
  "Start Date"?: string | null;
  "End Date"?: string | null;
  Time?: string | null;
  "Address / Location"?: string | null;
  "Postal Code"?: string | null;
  Category?: string | null;
  "Price / Ticket Info"?: string | null;
  Description?: string;
  "Image URL(s)"?: string[];
  Organizer?: string | null;
  "Official Event Link"?: string | null;
  url?: string[];
}

interface EventCardProps {
  event: Event;
  className?: string;
  onAddToPool?: (event: Event) => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, event: Event) => void;
}

export default function EventCard({
  event,
  className = "",
  onAddToPool,
  onDragStart,
}: EventCardProps) {
  const router = useRouter();
  const displayTitle = event.Title.replace(/^\d+\.\s*/, "");

  return (
    <Card
      isPressable
      isHoverable
      draggable={!!onDragStart}
      onDragStart={onDragStart ? (e) => onDragStart(e, event) : undefined}
      onClick={() => router.push(`/events/${event.id}`)}
      className={`flex flex-col h-full w-full transition-transform hover:scale-105 shadow rounded-lg bg-card cursor-pointer ${className}`}
      style={{ userSelect: "none" }}
    >
      <div className="relative">
        {event["Image URL(s)"]?.[0] && (
          <Image
            src={event["Image URL(s)"][0]}
            alt={displayTitle}
            className="h-40 w-full object-cover"
            height={160}
            width="100%"
          />
        )}
        {onAddToPool && (
          <button
            className="absolute bottom-2 right-2 bg-primary text-white rounded-full p-2 shadow hover:bg-accent transition"
            onClick={(e) => {
              e.stopPropagation();
              onAddToPool(event);
            }}
            aria-label="Add to event pool"
            type="button"
          >
            {/* Simple cart SVG */}
            <svg width={20} height={20} fill="none" viewBox="0 0 24 24">
              <path
                d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM7 18h10M5 6h14l-1.5 9h-11z"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
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
  );
}
