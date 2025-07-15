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

import { useRouter } from "next/navigation";
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { EventType } from '../types/event'; // Adjust path as needed

interface PlannerCardProps {
  event: EventType;
  onAdd: (event: EventType) => void;
  className?: string
}
const PLACEHOLDER_IMAGE = "/KiasuPlanner.png";

function getEventImage(images: unknown): string {
  if (Array.isArray(images)) {
    // Find the first non-null, non-empty string
    const validImage = images.find(
      (img) => typeof img === "string" && img.trim().length > 0
    );
    return validImage || "/KiasuPlanner.png";
  }
  // Handle if images is a single string
  if (typeof images === "string" && images.trim().length > 0) {
    return images;
  }
  return "/KiasuPlanner.png";
}

const schibstedFont = { fontFamily: '"Schibsted Grotesk", Arial, sans-serif' };
export default function PlannerCard({ event, onAdd, className }: PlannerCardProps) {

  const router = useRouter();
  const handleCardClick = () => {
    console.log("PlannerCard clicked", event);
    if (event.id) {
      router.push(`/events/${event.id}`);
    } else {
      console.warn("No event ID found!", event);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        cursor: "pointer",
        width: "100%",
        minWidth: 200,
        maxWidth: 340,
        height: "100%",
        maxheight: 350,
        minHeight: 300,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2,
        boxSizing: 'border-box',
        ...schibstedFont,
        boxShadow: 3,
        transition: 'box-shadow 0.2s, transform 0.2s',
        borderRadius: '16px',
        '&:hover': { boxShadow: 8, transform: 'scale(1.02)' },
               
      }}
 
    >
        {event.images && (
        <CardMedia
          component="img"
          height="140"
          image={getEventImage(event.images)}
          alt={event.title}
          sx={{ 
            borderRadius: 2, 
            objectFit: 'cover',
            width: "100%",          
            height: 180,
            backgroundColor: "#f3f4f6",
           }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom sx={schibstedFont}>
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
        <Typography variant="body2" color="text.secondary" sx={schibstedFont}>
          <strong>Price:</strong> {event.price || 'TBA'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={schibstedFont}>
          <strong>Address:</strong> {event.address || 'TBA'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, ...schibstedFont }} >
          {event.description || 'No description available.'}
        </Typography>
      </CardContent>
      <Button
        variant="contained"
        onClick={e =>{ e.stopPropagation(); onAdd(event);}}
        sx={{ mt: 2 }}
        className="w-full bg-primary text-white py-3 rounded-xl shadow"
        color="primary"
      >
        Add to Timeline
      </Button>
    </Card>
  );
}
