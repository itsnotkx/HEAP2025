/*

import { Button, Card, CardContent, Typography } from '@mui/material';
import { Event } from "../types/event";
import { useContext } from 'react';
import { TimelineContext } from '../app/planner/layout';
interface PlannerCardProps {
  event: Event;
  onAdd: (event: Event) => void;
}

export default function PlannerCard({ event, onAdd }: PlannerCardProps) {
  return (
    <Card
        sx={{
        width: 300,           // Set a fixed width (e.g., 300px)
        height: 250,          // Set a fixed height (e.g., 180px)
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 2,
        boxSizing: 'border-box'}}>
      <CardContent>
        <Typography variant="h6">{event.title}</Typography>
        <Typography>
      <strong>Date:</strong>{" "}
      {event.startDate ? new Date(event.startDate).toLocaleDateString() : "TBA"} –{" "}
      {event.endDate ? new Date(event.endDate).toLocaleDateString() : "TBA"}
        </Typography>
        <Typography>
          <strong>Address: </strong>
          {event.address}
        </Typography>
        <Typography>
        <strong>Price:</strong> {event.price || "TBA"}
        </Typography>
        <Button
          variant="contained"
          onClick={() => onAdd(event)}
          style={{ marginTop: 8 }}
        >
          Add to Timeline
        </Button>
      </CardContent>
    </Card>
  );
}
  */

import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { EventType } from '../types/event'; // Adjust path as needed

interface PlannerCardProps {
  event: EventType;
  onAdd: (event: EventType) => void;
  className?: string
}

export default function PlannerCard({ event, onAdd, className }: PlannerCardProps) {
  return (
    <Card
      sx={{
        width: 300,
        height: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2,
        boxSizing: 'border-box',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Date:</strong>{' '}
          {event.startDate
            ? new Date(event.startDate).toLocaleDateString()
            : 'TBA'}
          {' – '}
          {event.endDate
            ? new Date(event.endDate).toLocaleDateString()
            : 'TBA'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Price:</strong> {event.price || 'TBA'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Address:</strong> {event.address || 'TBA'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {event.description || 'No description available.'}
        </Typography>
      </CardContent>
      <Button
        variant="contained"
        onClick={() => onAdd(event)}
        sx={{ mt: 2 }}
      >
        Add to Timeline
      </Button>
    </Card>
  );
}
