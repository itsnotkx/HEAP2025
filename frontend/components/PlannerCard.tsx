"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/react";

import { EventType } from "../types/event";

interface PlannerCardProps {
  event: EventType;
  onAdd: (event: EventType) => void;
  className?: string;
}

const PLACEHOLDER_IMAGE = "/KiasuPlanner.png";

function getEventImage(images: unknown): string {
  if (Array.isArray(images)) {
    const validImage = images.find(
      (img) => typeof img === "string" && img.trim().length > 0,
    );

    return validImage || PLACEHOLDER_IMAGE;
  }
  if (typeof images === "string" && images.trim().length > 0) {
    return images;
  }

  return PLACEHOLDER_IMAGE;
}

export default function PlannerCard({
  event,
  onAdd,
  className,
}: PlannerCardProps) {
  const router = useRouter();
  const imageUrl = getEventImage(event.images);

  const handleCardClick = () => {
    if (event.id !== undefined && event.id !== null) {
      router.push(`/events/${event.id}`);
    } else {
      console.warn("Invalid event ID, cannot route:", event);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card's onClick
    onAdd(event);
  };

  return (
    <Card
      className={`w-full max-w-sm h-full shadow-md hover:shadow-lg cursor-pointer ${className}`}
      style={{ fontFamily: '"Schibsted Grotesk", sans-serif' }}
      // Removing onClick from here to avoid duplicate event handling;
      // making the focusable div handle interaction instead
    >
      {/* Making this div the interactive element */}
      <div
        className="focus:outline-none"
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
      >
        <CardHeader className="p-0">
          <Image
            alt={event.title}
            className="w-full object-cover rounded-t-2xl bg-gray-100"
            src={imageUrl}
          />
        </CardHeader>
        <CardHeader className="text-lg font-semibold">{event.title}</CardHeader>
        <CardBody className="text-sm text-gray-600">
          <strong>Date:</strong>{" "}
          {event.startDate
            ? new Date(event.startDate).toLocaleDateString()
            : "TBA"}
          {" – "}
          {event.endDate
            ? new Date(event.endDate).toLocaleDateString()
            : "TBA"}{" "}
          <br />
          <strong>Price:</strong> {event.price || "TBA"}
          <br />
          <strong>Address:</strong> {event.address || "TBA"}
        </CardBody>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full bg-primary text-white py-2 rounded-xl shadow"
            type="button"
            onClick={handleAddClick}
          >
            ADD TO DAY
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
