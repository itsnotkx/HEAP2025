"use client";
import React, { useEffect } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import { timelineItemClasses } from "@mui/lab/TimelineItem";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";

import { EventType } from "../../types/event";
import { useTimeline } from "../../components/Timeline/TimelineContext";

interface DayPlannerProps {
  events: EventType[];
  addEventToTimeline: (event: EventType, duration: number) => void;
}

type TravelMode = "transit" | "driving" | "walking" | "bicycling";

// 📍 Utilities
function GoogleMapsRouteButton({
  from,
  to,
  mode,
}: {
  from: string;
  to: string;
  mode: TravelMode;
}) {
  const handleClick = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      from,
    )}&destination=${encodeURIComponent(to)}&travelmode=${mode}`;

    window.open(url, "_blank");
  };

  return (
    <Link showAnchorIcon onPress={handleClick}>
      View Route
    </Link>
  );
}

// 📍 Main Component
export default function DayPlanner({
  events,
  addEventToTimeline,
}: DayPlannerProps) {
  const { timeline, moveTimelineEntry, removeTimeLineEntry } = useTimeline();

  const handleAddEvent = (event: EventType) => {
    addEventToTimeline(event, 60); // default 1 hr
  };

  useEffect(() => {
    console.log("🚀 Timeline updated:", timeline);
  }, [timeline]);

  return (
    <div className="w-full pl-5">
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {timeline.map((item, idx) => {
          const isLast = idx === timeline.length - 1;

          // 🟩 Render EVENT
          if (item.type === "event" && item.event) {
            return (
              <TimelineItem key={idx}>
                <TimelineSeparator>
                  <TimelineDot sx={{ backgroundColor: "#2EC4B6" }} />
                  {!isLast && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent className="w-full">
                  <Card className="w-full max-w-sm shadow-md hover:shadow-lg rounded-2xl pr-3">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <CardHeader className="pb-1 pt-1 font-bold">
                          <span>{item.event.title}</span>
                          <Button
                            isIconOnly
                            className="ml-2 text-gray-500"
                            radius="full"
                            size="sm"
                            variant="light"
                            onPress={() => removeTimeLineEntry(idx)}
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </Button>
                        </CardHeader>
                        <CardBody className="pb-2 text-sm tracking-tight text-default-400">
                          {item.event.address}
                        </CardBody>
                      </div>

                      <div className="flex flex-col gap-1 ml-2">
                        <Button
                          isIconOnly
                          className="h-7 w-7 text-white"
                          color="primary"
                          onPress={() => moveTimelineEntry(idx, "up")}
                        >
                          <ChevronUpIcon />
                        </Button>
                        <Button
                          isIconOnly
                          className="h-7 w-7 text-white"
                          color="secondary"
                          onPress={() => moveTimelineEntry(idx, "down")}
                        >
                          <ChevronDownIcon />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            );
          }

          // 🟥 Render TRAVEL
          if (item.type === "travel") {
            return (
              <TimelineItem key={idx}>
                <TimelineSeparator>
                  <TimelineDot sx={{ backgroundColor: "#FF6B6B" }} />
                  {!isLast && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Card className="w-full max-w-sm h-full shadow-md hover:shadow-lg rounded-2xl">
                    <CardHeader className="pb-0 font-bold">
                      Travel - {item.mode?.toUpperCase() || "N/A"}
                    </CardHeader>
                    <CardBody className="pb-0 pt-1">
                      <p>
                        Estimated Duration:{" "}
                        <strong className="text-xs text-default-600">
                          {item.duration} mins
                        </strong>
                      </p>
                      <p className="text-sm text-gray-500">
                        From: {item.from}
                        <br />
                        To: {item.to}
                      </p>
                    </CardBody>
                    <CardBody>
                      <GoogleMapsRouteButton
                        from={item.from}
                        mode={item.mode as TravelMode}
                        to={item.to}
                      />
                    </CardBody>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            );
          }

          return null;
        })}
      </Timeline>
    </div>
  );
}
