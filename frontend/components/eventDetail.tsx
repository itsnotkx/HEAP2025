"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  CardMedia,
  Tabs,
  Tab,
  Paper,
  Button,
} from "@mui/material";
import { EventType } from "../types/event";

const PLACEHOLDER_IMAGE = "../KiasuPlanner.png";

// Color palette
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

function TabPanel(props: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`event-tabpanel-${index}`}
      aria-labelledby={`event-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2, px: 1 }}>
          <Paper
            elevation={1}
            sx={{
              borderRadius: 2,
              p: 2,
              backgroundColor: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              boxShadow: "0 1.5px 5px rgba(0, 0, 0, 0.05)",
            }}
          >
            {children}
          </Paper>
        </Box>
      )}
    </div>
  );
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
        variant="h4"
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
      >
        {event.title}
      </Typography>

      {/* Event Image */}
      <CardMedia
        component="img"
        height="320"
        image={imageUrl}
        alt={event.title}
        sx={{
          width: "100%",
          objectFit: "cover",
          borderRadius: "22px",
          mb: 2,
          backgroundColor: COLORS.highlight,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          border: `1.2px solid ${COLORS.border}`,
        }}
      />

      {/* Tabs */}
      <Box sx={{ px: 3, pb: 4 }}>
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            backgroundColor: COLORS.highlight,
            borderRadius: 2,
            mb: 2,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1.05rem",
              color: COLORS.secondaryText,
            },
            "& .Mui-selected": {
              color: COLORS.primary,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: COLORS.primary,
            },
          }}
        >
          <Tab label="Description" />
          <Tab label="Location" />
        </Tabs>

        {/* Tab Panels */}
        <TabPanel value={tab} index={0}>
          <Typography
            sx={{
              color: COLORS.secondaryText,
              fontSize: "1.03rem",
              fontFamily: '"Schibsted Grotesk", Arial, sans-serif',
            }}
          >
            {event.description || "No description available."}
          </Typography>
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <iframe
            allowFullScreen
            height="350"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              event.address
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
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="contained"
              sx={{
                backgroundColor: COLORS.primary,
                "&:hover": {
                  backgroundColor: "#3ABCB7",
                },
              }}
              onClick={() => navigator.clipboard.writeText(event.address)}
            >
              Copy Address
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: COLORS.accent,
                "&:hover": {
                  backgroundColor: "#FF4C4C",
                },
              }}
              onClick={() =>
                window.open(
                  `https://maps.google.com/?q=${encodeURIComponent(
                    event.address
                  )}`,
                  "_blank"
                )
              }
            >
              Open in Google Maps
            </Button>
          </Box>
        </TabPanel>
      </Box>
    </main>
  );
}
