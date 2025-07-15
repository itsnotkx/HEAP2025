import React from "react";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter} from "@heroui/card";
import { EventType } from "../types/event"; // Adjust path as needed
import {Image} from "@heroui/react";
import NextImage from "next/image";


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

export default function PlannerCard({ event, onAdd, className }: PlannerCardProps) {
  const imageUrl = getEventImage(event.images);

  return (
    <Card className={`w-full max-w-sm h-full shadow-md hover:shadow-lg rounded-2xl ${className}`}>
      <CardHeader className="p-0">
        <Image
          src={imageUrl}
          alt={event.title}
          // as={NextImae}
          className="w-full object-cover rounded-t-2xl bg-gray-100"
        />
      </CardHeader>

        <CardHeader className="text-lg font-semibold">
          {event.title}
        </CardHeader>
        <CardBody className="text-sm text-gray-600">
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
        <p className="text-sm text-gray-700 mt-1">
          {event.description || "No description available."}
        </p>
      </CardBody>

      <CardFooter className="p-4 pt-0">
        <Button
          onPress={() => onAdd(event)}
          className="w-full bg-primary text-white py-2 rounded-xl shadow"
        >
          ADD TO DAY
        </Button>
      </CardFooter>
    </Card>
  );
}
