"use client";
import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";

interface Event {
  id: number;
  title: string;
  start: number; // e.g., 9 for 9:00
  end: number;   // e.g., 10 for 10:00
}

const initialEvents: Event[] = [
  { id: 1, title: "Meeting", start: 9, end: 10 },
  { id: 2, title: "Work Session", start: 11, end: 12 },
];

function formatTime(hour: number) {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export default function DayPlannerTimeline() {
  const [events] = React.useState<Event[]>(initialEvents);

  return (
    <Timeline position="right">
      {events.map((ev, idx) => (
        <TimelineItem key={ev.id}>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            {idx !== events.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="h6">{ev.title}</Typography>
            <Typography color="text.secondary">
              {formatTime(ev.start)} – {formatTime(ev.end)}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
