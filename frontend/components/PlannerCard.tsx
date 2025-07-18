"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/react";

import { EventType } from "../types/event";
import { get } from "http";

interface PlannerCardProps {
  event: EventType;
  onAdd: (event: EventType) => void;
  className?: string;
}

const PLACEHOLDER_IMAGE = "/KiasuPlanner.png";

function getEventImage(images: unknown): string {
  if (Array.isArray(images)) {
    const validImage = images.find(
      (img) => typeof img === "string" && img.trim().length > 0
    );

    return validImage || PLACEHOLDER_IMAGE;
  }
  if (typeof images === "string" && images.trim().length > 0) {
    return images;
  }

  return PLACEHOLDER_IMAGE;
}

const PlannerCard: React.FC<PlannerCardProps> = ({
  event,
  onAdd,
  className,
}) => {
  const router = useRouter();
  const imageUrl = getEventImage(event.images);

  // Navigate to event details page
  const handleCardClick = () => {
    if ((event as any).event_id !== undefined && (event as any).event_id !== null) {
      router.push(`/events/${(event as any).event_id}`);
    } else {
      console.warn("Invalid event ID, cannot route:", event);
    }
  };

  // Support keyboard accessibility (Enter, Space) for clickable div
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  // Handle Add button click and prevent event bubbling to main clickable div
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(event);
  };

  return (
    <Card
      onClick={() => {
        console.log("Card clicked");
        handleCardClick();
      }}
      className={`w-full max-w-sm h-full flex flex-col shadow-md hover:shadow-lg cursor-pointer ${className}`}
      style={{ fontFamily: '"Schibsted Grotesk", sans-serif' }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        className="flex flex-col flex-grow min-h-0"
        style={{ cursor: 'pointer' }}
      >
        <CardHeader className="p-0 justify-center">
          <Image
            src={imageUrl}
            fallbackSrc="/KiasuPlanner.png"
            alt={event.title}
            className="w-full rounded-t-2xl bg-gray-100 cover h-[200px]"
          /> 
        </CardHeader>

        <CardHeader className="text-lg font-semibold">
          {event.title}
        </CardHeader>

        <CardBody className="text-sm text-gray-600 flex-grow min-h-0">
          <strong>Date:</strong>{" "}
          {event.startDate
            ? new Date(event.startDate).toLocaleDateString()
            : "TBA"}
          {" – "}
          {event.endDate
            ? new Date(event.endDate).toLocaleDateString()
            : "TBA"}
          <strong>Price:</strong> {event.price || "TBA"}
          <strong>Address:</strong> {event.address || "TBA"}
        </CardBody>

        {/* Footer stays at bottom since above grows */}
        <CardFooter className="p-4 pt-0 mt-auto">
          <Button
            type="button"
            onClick={handleAddClick}
            className="w-full bg-primary text-white py-2 rounded-xl shadow"
          >
            ADD TO DAY
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default PlannerCard;
