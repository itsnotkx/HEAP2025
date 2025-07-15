import React, { useState } from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import {Button, ButtonGroup} from "@heroui/button";
import PlannerCard from '../PlannerCard';
import { EventType } from "../../types/event";
import type { TimelineEntry } from "../../types/event";
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';


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
        onChange={e => setMode(e.target.value)}
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
}

interface GoogleMapsRouteButtonProps {
  from: string;
  to: string;
  mode: TravelMode;
}

function GoogleMapsRouteButton({ from, to, mode } : GoogleMapsRouteButtonProps) {
  const handleClick = () => {
    const origin = encodeURIComponent(from);
    const destination = encodeURIComponent(to);
    const travelMode = encodeURIComponent(mode); // e.g., driving, walking, transit, bicycling

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${travelMode}`;
    window.open(url, '_blank');
  };

  return (
    <Button
      onPress={handleClick}
     >
      View Route on Google Maps
    </Button>
  );
}

export default function DayPlanner({ events, timeline, addEventToTimeline }: DayPlannerProps) {
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
      <TravelModeSelector mode={mode} setMode={setMode} />
      <Typography variant="h4" gutterBottom>Day Planner</Typography>

      <div>


        <Timeline position="alternate">
  {timeline.map((item, idx) => {
    if (item.type === 'event' && item.event) {
      return (
        <TimelineItem key={idx}>
          <TimelineOppositeContent color="text.secondary">

          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            {idx < timeline.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="h6" component="span">
              {item.event.title}
            </Typography>
            <Typography variant="body2">{item.event.address}</Typography>
          </TimelineContent>
        </TimelineItem>
      );
    }
    if (item.type === 'travel') {
      return (
        <TimelineItem key={idx}>
          <TimelineOppositeContent color="text.secondary">
            {item.duration} 
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="secondary" />
            {idx < timeline.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="h6" color="secondary">
              Travel
            </Typography>
            <Typography variant="body2">
              {item.from} → {item.to}
            </Typography>
             <GoogleMapsRouteButton from={item.from} to={item.to} mode={mode} />
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

/*
        <Timeline position="alternate">
          {timeline.map((item, idx) => (
            <TimelineItem key={idx}>
              <TimelineOppositeContent color="text.secondary">
                {item.duration} mins
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                {idx < timeline.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6" component="span">
                  {item.event.title}
                </Typography>
                <Typography variant="body2">{item.event.address}</Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>


        */