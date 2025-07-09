"use client";
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import clsx from "clsx";
import NavigationBar from "@/components/navbar";
import SideBar from "@/components/Timeline/SideBar";

import { Providers } from "@/app/providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

import React, { createContext, useState, useEffect } from "react";
import { mapRawEvent } from "../../types/event";
import { fetchAllEvents, fetchFilteredEvents } from "../api/events";
import type { EventType,TimelineEntry } from "../../types/event";
import { getDistanceBetweenVenues } from "../api/apis";

import { TimelineContext } from "../../components/Timeline/TimelineContext";

/*
interface TimelineEntry {
  event: EventType;
  duration: number;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Timeline state
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const addEventToTimeline = (event, duration) => {
    setTimeline([...timeline, { event, duration }]);
  };

  // Events state and fetch logic
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchAllEvents()
      .then(data => setEvents(data.map(mapRawEvent)))
      .catch(() => setError("Unable to load events."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={clsx(
      "min-h-screen text-foreground bg-background font-sans antialiased",
      fontSans.variable
    )}>
      <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
        <NavigationBar shouldHideOnScroll={false}/>
        <div className="relative">
          <div className="flex">
            <div
              className="fixed left-0 top-[60px] h-[calc(100vh-20px)] border-r bg-white shadow z-20"
              style={{
                width: sidebarExpanded ? 400 : 70,
                transition: "width 0.3s",
              }}>
              <SideBar
                events={events}
                loading={loading}
                error={error}
                expanded={sidebarExpanded}
                setExpanded={setSidebarExpanded}
                timeline={timeline}
                addEventToTimeline={addEventToTimeline}
              />
            </div>
            <div
              className="w-full"
              style={{
                paddingLeft: sidebarExpanded ? 400 : 70,
                transition: "padding-left 0.3s",
              }}
            >
              <div className="flex justify-center mx-auto">
                <div className="w-full md:max-w-6xl px-4 py-8">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Providers>
    </div>
  );
}
*/

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  /*
  const addEventToTimeline = (event: EventType, duration: number) => {
    setTimeline([...timeline, { type: 'event', event, duration }]);
  };
  */

  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEventToTimeline = async (event: EventType, duration: number) => {
  setTimeline(prevTimeline => {
    // We'll handle the async part outside this function
    return prevTimeline;
  });

  // Get the current timeline (snapshot)
  const prevTimeline = timeline;
  const newTimeline = [...prevTimeline];

  // Find the last event in the timeline
  const lastEventEntry = [...prevTimeline].reverse().find(
    entry => entry.type === 'event'
  ) as { type: 'event'; event: EventType; duration: number } | undefined;

  if (lastEventEntry) {
    try {
      const { duration: travelDuration } = await getDistanceBetweenVenues(
        lastEventEntry.event.address,
        event.address
      );
      newTimeline.push({
        type: 'travel',
        from: lastEventEntry.event.address,
        to: event.address,
        duration: travelDuration,
      });
    } catch (err) {
      console.error("Failed to fetch travel duration", err);
    }
  }

  newTimeline.push({
    type: 'event',
    event,
    duration,
  });

  setTimeline(newTimeline);
};

  useEffect(() => {
    setLoading(true);
    fetchAllEvents()
      .then(data => setEvents(data.map(mapRawEvent)))
      .catch(() => setError("Unable to load events."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <TimelineContext.Provider value={{ timeline, addEventToTimeline }}>
    <div className={clsx(
      "min-h-screen text-foreground bg-background font-sans antialiased",
      fontSans.variable
    )}>
      <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
        <NavigationBar shouldHideOnScroll={false}/>
        <div className="relative">
          <div className="flex">
            <div
              className="fixed left-0 top-[60px] h-[calc(100vh-20px)] border-r bg-white shadow z-20"
              style={{
                width: sidebarExpanded ? 400 : 70,
                transition: "width 0.3s",
              }}>
              <SideBar
                events={events}
                loading={loading}
                error={error}
                expanded={sidebarExpanded}
                setExpanded={setSidebarExpanded}
                timeline={timeline}
                addEventToTimeline={addEventToTimeline}
              />
            </div>
            <div
              className="w-full"
              style={{
                paddingLeft: sidebarExpanded ? 400 : 70,
                transition: "padding-left 0.3s",
              }}
            >
              <div className="flex justify-center mx-auto">
                <div className="w-full md:max-w-6xl px-4 py-8">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Providers>
    </div>
    </TimelineContext.Provider>
  )

}
