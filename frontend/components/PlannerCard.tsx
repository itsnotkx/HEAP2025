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
    if (event.id !== undefined && event.id !== null) {
      router.push(`/events/${event.id}`);
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
      className={`w-full max-w-sm  shadow-md hover:shadow-lg cursor-pointer flex flex-col ${className}`}
      style={{ fontFamily: '"Schibsted Grotesk", sans-serif' }}
    >
      <CardHeader className="p-0">
        <Image
          src={imageUrl}
          fallbackSrc={PLACEHOLDER_IMAGE}
          alt={event.title}
          className="w-full min-h-[200px] max-h-[200px] object-cover bg-gray-100 rounded-t-2xl"
        />
      </CardHeader>

      <CardBody className="text-sm text-gray-600 flex-1 flex flex-col px-4 py-2">
        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
        <p>
          <strong>Date:</strong>{" "}
          {event.startDate
            ? new Date(event.startDate).toLocaleDateString()
            : "TBA"}
          {" – "}
          {event.endDate ? new Date(event.endDate).toLocaleDateString() : "TBA"}
        </p>
        <p>
          <strong>Price:</strong> {event.price || "TBA"}
        </p>
        <p>
          <strong>Address:</strong> {event.address || "TBA"}
        </p>
      </CardBody>

      <CardFooter className="mt-auto p-4 pt-0">
        <Button
          type="button"
          onClick={handleAddClick}
          className="w-full bg-primary text-white py-2 rounded-xl shadow"
        >
          ADD TO DAY
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlannerCard;
