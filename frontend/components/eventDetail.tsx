"use client";
import { useState } from "react";
import { Box, Typography, CardMedia } from "@mui/material";
import { EventType } from "../types/event";
import {Tabs, Tab, Card, CardBody} from "@heroui/react";

const PLACEHOLDER_IMAGE = "/placeholder.jpg"; // Ensure this exists in /public
const schibstedFont = { fontFamily: '"Schibsted Grotesk", Arial, sans-serif' };

interface EventDetailProps {
  event: EventType;
}

export default function EventDetail({ event } : EventDetailProps ) {
  const [tab, setTab] = useState(0);

  const imageUrl =
    Array.isArray(event.images) && event.images.length > 0 && event.images[0]
      ? event.images[0]
      : PLACEHOLDER_IMAGE;

  return (
    <main className="pt-20 font-[Schibsted Grotesk]">
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, p: 2 }}>
      {/* Event Name */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, schibstedFont }}>
        {event.title}
      </Typography>

      {/* Event Image */}
      <CardMedia
        component="img"
        image={imageUrl}
        alt={event.title}
        sx={{
          width: "100%",
          height: 300,
          objectFit: "cover",
          borderRadius: 2,
          mb: 3,
          backgroundColor: "#f3f4f6",
        }}
        />
        <Tabs aria-label="Options">
        <Tab key="Description" title="Description">
          <Card>
            <CardBody className="font-schibsted-grotesk">
              {event.description || "No description available."}
            </CardBody>
          </Card>
        </Tab>
        <Tab key="Location" title="Location">
          <Card style={{ height: "430px" }}>
            <CardBody>
              <iframe
                title="Event Location"
                width="100%"
                height="350"
                style={{ border: 0, borderRadius: 8 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  event.address
                )}&output=embed`}
              />
              <div
    style={{
      position: "absolute",
      bottom: 16,
      right: 16,
      display: "flex",
      gap: 10,
      zIndex: 1,
    }}
  >
    <button
      style={{
        fontFamily: '"Schibsted Grotesk", Arial, sans-serif',
        padding: "8px 12px",
        borderRadius: 6,
        border: "none",
        background: "#2EC4B6",
        color: "#fff",
        fontWeight: 500,
        cursor: "pointer",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
      onClick={() => {
        navigator.clipboard.writeText(event.address);
      }}
    >
      Copy Address
    </button>
    <button
      style={{
        fontFamily: '"Schibsted Grotesk", Arial, sans-serif',
        padding: "8px 12px",
        borderRadius: 6,
        border: "none",
        background: "#FF6B6B",
        color: "#fff",
        fontWeight: 500,
        cursor: "pointer",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
      onClick={() => {
        window.open(
          `https://maps.google.com/?q=${encodeURIComponent(event.address)}`,
          "_blank"
        );
      }}
    >
      Open in Google Maps
    </button>
  </div>
          </CardBody>
          </Card>
        </Tab>
      </Tabs>
      

   
     
    </Box>
    </main>
  );
}
