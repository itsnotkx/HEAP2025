import React, { useState } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

import { Card, CardHeader, CardBody, CardFooter} from "@heroui/card";
import {Link} from "@heroui/link";

import { Button, ButtonGroup } from "@heroui/button";
import PlannerCard from "../PlannerCard";
import { EventType } from "../../types/event";
import type { TimelineEntry } from "../../types/event";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (duration: number) => void;
  event: EventType | null;
}

type TravelMode = "transit" | "driving" | "walking" | "bicycling";

interface TravelModeSelectorProps {
  mode: TravelMode;
  setMode: (mode: TravelMode) => void;
}

function TravelModeSelector({ mode, setMode }: TravelModeSelectorProps) {
  return (
    <FormControl size="small" sx={{ minWidth: 120, mb: 2 }}>
      <InputLabel id="mode-label">Travel Mode</InputLabel>
      <Select
        labelId="mode-label"
        value={mode}
        label="Travel Mode"
        onChange={(e) => setMode(e.target.value)}
      >
        <MenuItem value="transit">Transit</MenuItem>
        <MenuItem value="driving">Driving</MenuItem>
        <MenuItem value="walking">Walking</MenuItem>
        <MenuItem value="bicycling">Bicycling</MenuItem>
      </Select>
    </FormControl>
  );
}

interface DayPlannerProps {
  events: EventType[];
  timeline: TimelineEntry[];
  addEventToTimeline: (event: EventType, duration: number) => void;
  moveTimelineEntry: (fromIndex: number, direction:"up" | "down") => void;
}

interface GoogleMapsRouteButtonProps {
  from: string;
  to: string;
  mode: TravelMode;
}

function GoogleMapsRouteButton({ from, to, mode }: GoogleMapsRouteButtonProps) {
  const handleClick = () => {
    const origin = encodeURIComponent(from);
    const destination = encodeURIComponent(to);
    const travelMode = encodeURIComponent(mode); // e.g., driving, walking, transit, bicycling

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${travelMode}`;
    window.open(url, "_blank");
  };

  return <Link showAnchorIcon onPress={handleClick}>View Route</Link>;
}

export default function DayPlanner({
  events,
  timeline,
  addEventToTimeline,
  moveTimelineEntry,
}: DayPlannerProps) {
  // REMOVE: const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<EventType | null>(null);
  const [mode, setMode] = useState<TravelMode>("transit");
  const handleAddEvent = (event: EventType) => {
    setPendingEvent(event);
    setShowModal(true);
  };

  const handleDurationSubmit = (duration: number) => {
    if (pendingEvent) {
      // Use the prop function to update timeline in parent!
      addEventToTimeline(pendingEvent, duration);
    }
    setShowModal(false);
    setPendingEvent(null);
  };

  return (
    <>
      <div className="pl-5 w-full flex justify-start">
        <TravelModeSelector mode={mode} setMode={setMode} />
      </div>

      <div className="w-full">
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >

          {timeline.map((item, idx) => {
            if (item.type === "event" && item.event) {
              return (
                <TimelineItem key={idx}>
                  <TimelineSeparator>
                    <TimelineDot sx={{ backgroundColor: '#2EC4B6'}}/>
                    {idx < timeline.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>


                  <TimelineContent className="w-full">
                    <Card className="w-full max-w-sm h-full shadow-md hover:shadow-lg rounded-2xl pr-3">
                      <div className="flex justify-between items-start">
                        
                        <div className="flex flex-col">
                          <CardHeader className="pb-1 pt-1 font-bold">{item.event.title}</CardHeader>
                          <CardBody className="pb-2 text-sm tracking-tight text-default-400">
                            {item.event.address}
                          </CardBody>
                        </div>

                        <div className="flex flex-col gap-1 ml-2">

                          <Button onPress={() => moveTimelineEntry(idx, "up")} isIconOnly color="primary" className="h-7 w-7 text-white px-2 mt-2 mb-0"><ChevronUpIcon/></Button>
                          <Button onPress={() => moveTimelineEntry(idx, "down")} isIconOnly color="secondary" className="h-7 w-7 text-white px-2 mt-0"><ChevronDownIcon/></Button>
                          
                        </div>
                      </div>
                    </Card>

                  </TimelineContent>
                </TimelineItem>
              );
            }
            if (item.type === "travel") {
              return (
                <TimelineItem key={idx}>
                  <TimelineSeparator>
                    <TimelineDot sx={{ backgroundColor: '#FF6B6B'}}/>
                    {idx < timeline.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Card className="w-full max-w-sm h-full shadow-md hover:shadow-lg rounded-2xl">
                      <CardHeader className="pb-0 font-bold">Travel</CardHeader>
                      <CardBody className="pb-0 pt-1">
                        <p>{item.duration}</p>
                        <p className="text-small tracking-tight text-default-400">
                          From: {item.from}<br/> To: {item.to}
                        </p>
                        </CardBody>
                      <CardBody>
                        <GoogleMapsRouteButton
                          from={item.from}
                          to={item.to}
                          mode={mode}
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
    </>
  );
}
