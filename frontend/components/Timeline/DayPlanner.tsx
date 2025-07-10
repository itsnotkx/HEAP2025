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
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import PlannerCard from '../PlannerCard';
import { EventType } from "../../types/event";
import type { TimelineEntry } from "../../types/event";


interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (duration: number) => void;
  event: EventType | null;
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

interface DayPlannerProps {
  events: EventType[];
  timeline: TimelineEntry[];
  addEventToTimeline: (event: EventType, duration: number) => void;
}

export default function DayPlanner({ events, timeline, addEventToTimeline }: DayPlannerProps) {
  // REMOVE: const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<EventType | null>(null);

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
      <Typography variant="h4" gutterBottom>Day Planner</Typography>

      <div>
        <DurationModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleDurationSubmit}
          event={pendingEvent}
        />

        <Timeline position="alternate">
  {timeline.map((item, idx) => {
    if (item.type === 'event' && item.event) {
      return (
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
      );
    }
    if (item.type === 'travel') {
      return (
        <TimelineItem key={idx}>
          <TimelineOppositeContent color="text.secondary">
            {item.duration} mins
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