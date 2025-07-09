/*
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
*/

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography
} from '@mui/material';

interface Event {
  id: number;
  title: string;
  address: string;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (duration: number) => void;
  event: Event | null;
}

function DurationModal({ open, onClose, onSubmit, event }: ModalProps) {
  const [duration, setDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (duration) {
      onSubmit(Number(duration));
      setDuration('');
    }
  };

  React.useEffect(() => {
    if (!open) setDuration('');
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add "{event?.title}"</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="How long do you want to stay? (minutes)"
            type="number"
            fullWidth
            required
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Add to Planner</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default function DayPlanner() {
  const [timeline, setTimeline] = useState<{ event: Event; duration: number }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<Event | null>(null);

  // Example event to add (replace with your real event data)
  const sampleEvent: Event = {
    id: 1,
    title: 'Visit Museum',
    address: '123 Museum Rd'
  };

  const handleAddEvent = (event: Event) => {
    setPendingEvent(event);
    setShowModal(true);
  };

  const handleDurationSubmit = (duration: number) => {
    if (pendingEvent) {
      setTimeline([...timeline, { event: pendingEvent, duration }]);
    }
    setShowModal(false);
    setPendingEvent(null);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Day Planner</Typography>
      <Button variant="contained" onClick={() => handleAddEvent(sampleEvent)}>
        Add First Event
      </Button>

      <DurationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleDurationSubmit}
        event={pendingEvent}
      />

      <Typography variant="h6" style={{ marginTop: 24 }}>Timeline</Typography>
      <ul>
        {timeline.map((item, idx) => (
          <li key={idx}>
            {item.event.title} — {item.duration} mins
          </li>
        ))}
      </ul>
    </div>
  );
}
