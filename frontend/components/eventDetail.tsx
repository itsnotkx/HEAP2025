"use client";
import { useState } from "react";
import { Box, Typography, CardMedia } from "@mui/material";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { EventType } from "../types/event";

const PLACEHOLDER_IMAGE = "/placeholder.jpg";

// Color variables from image
const COLORS = {
  primary: "#4EC9C4",
  accent: "#FF6B6B",
  background: "#FAFBFC",
  card: "#FFFFFF",
  primaryText: "#333333",
  secondaryText: "#636876",
  border: "#E6E8EB",
  highlight: "#D1FAF3",
};

interface EventDetailProps {
  event: EventType;
}

export default function EventDetail({ event }: EventDetailProps) {
  const [tab, setTab] = useState(0);

  const imageUrl =
    Array.isArray(event.images) && event.images.length > 0 && event.images[0]
      ? event.images[0]
      : PLACEHOLDER_IMAGE;

  return (
    <main
      className="pt-20 font-[Schibsted Grotesk] min-h-screen"
      style={{ background: COLORS.background }}
    >

        {/* Event Name */}
        <Typography
          sx={{
            fontWeight: 800,
            letterSpacing: -1,
            mb: 1.5,
            px: 3,
            color: COLORS.primaryText,
            fontFamily: '"Schibsted Grotesk", Arial, sans-serif',
            pt: 3,
            fontSize: "2.25rem",
          }}
          variant="h4"
        >
          {event.title}
        </Typography>

        {/* Event Image */}
        <CardMedia
          alt={event.title}
          component="img"
          image={imageUrl}
          sx={{
            width: "100%",
            height: 320,
            objectFit: "cover",
            borderRadius: "22px",
            mb: 2,
            backgroundColor: COLORS.highlight,
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
            border: `1.2px solid ${COLORS.border}`,
          }}
        />
        
        {/* Tabs with themed colors */}
        <Box
          sx={{
            px: 3,
            pb: 4,
          }}
        >
          <Tabs
            aria-label="Options"
            className="font-schibsted-grotesk"
            selectedIndex={tab}
            onChange={i => setTab(i)}
            style={{
              background: COLORS.highlight,
              borderRadius: 14,
              padding: 2,
              marginBottom: 16,
              border: `1px solid ${COLORS.border}`,
            }}
            tabStyle={{
              color: COLORS.secondaryText,
              fontWeight: 600,
              fontSize: "1.08rem",
            }}
            activeTabStyle={{
              color: COLORS.primary,
              borderBottom: `3px solid ${COLORS.primary}`,
              background: "#fff",
            }}
          >
            <Tab key="Description" title="Description">
              <Card
                style={{
                  borderRadius: 14,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.card,
                  boxShadow: "0 1.5px 5px 0 rgba(0, 0, 0, 0.05)",
                }}
              >
                <CardBody
                  className="font-schibsted-grotesk"
                  style={{ color: COLORS.secondaryText, fontSize: "1.03rem" }}
                >
                  {event.description || "No description available."}
                </CardBody>
              </Card>
            </Tab>
            <Tab key="Location" title="Location">
              <Card
                style={{
                  height: 430,
                  borderRadius: 14,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.card,
                  boxShadow: "0 1.5px 5px 0 rgba(0, 0, 0, 0.04)",
                  position: "relative",
                }}
              >
                <CardBody style={{ position: "relative", height: "100%" }}>
                  <iframe
                    allowFullScreen
                    height="350"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      event.address,
                    )}&output=embed`}
                    style={{
                      border: 0,
                      borderRadius: 8,
                      width: "100%",
                      marginBottom: 12,
                      background: COLORS.highlight,
                    }}
                    title="Event Location"
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 20,
                      right: 22,
                      display: "flex",
                      gap: 12,
                      zIndex: 2,
                    }}
                  >
                    <button
                      style={{
                        fontFamily: '"Schibsted Grotesk", Arial, sans-serif',
                        padding: "9px 16px",
                        borderRadius: 8,
                        border: "none",
                        background: COLORS.primary,
                        color: "#fff",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 1px 6px rgba(44, 201, 198, 0.11)",
                        fontSize: "1rem",
                        transition: "background 0.16s",
                      }}
                      onClick={() => navigator.clipboard.writeText(event.address)}
                    >
                      Copy Address
                    </button>
                    <button
                      style={{
                        fontFamily: '"Schibsted Grotesk", Arial, sans-serif',
                        padding: "9px 16px",
                        borderRadius: 8,
                        border: "none",
                        background: COLORS.accent,
                        color: "#fff",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 1px 6px rgba(255, 107, 107, 0.11)",
                        fontSize: "1rem",
                        transition: "background 0.16s",
                      }}
                      onClick={() => {
                        window.open(
                          `https://maps.google.com/?q=${encodeURIComponent(event.address)}`,
                          "_blank",
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
