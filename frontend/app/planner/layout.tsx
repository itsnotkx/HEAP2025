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



export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mode, setMode] = useState<"transit" | "driving" | "walking" | "bicycling">("transit");
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  /*
  const addEventToTimeline = (event: EventType, duration: number) => {
    setTimeline([...timeline, { type: 'event', event, duration }]);
  };
  */

  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEventToTimeline = async (
  event: EventType,
  duration: number,
  modeParam: "transit" | "driving" | "walking" | "bicycling" = "transit"
) => {
  setTimeline(prevTimeline => prevTimeline);

  const prevTimeline = timeline;
  const newTimeline = [...prevTimeline];

  const lastEventEntry = [...prevTimeline].reverse().find(
    entry => entry.type === 'event'
  ) as { type: 'event'; event: EventType; duration: number } | undefined;

  if (lastEventEntry) {
    try {
      const { duration: travelDuration } = await getDistanceBetweenVenues(
        lastEventEntry.event.address,
        event.address,
        modeParam // Use the selected mode here
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
              className="fixed left-0 top-[60px] h-[calc(100%)] border-r bg-white overflow-y-auto z-20"
              style={{
                width: sidebarExpanded ? 400 : 70,
                transition: "width 0.1s",
              }}>
              <SideBar
                events={events}
                loading={loading}
                error={error}
                expanded={sidebarExpanded}
                setExpanded={setSidebarExpanded}
                timeline={timeline}
                addEventToTimeline={(event, duration, modeParam) => addEventToTimeline(event, duration, modeParam)}
                mode={mode}
                setMode={setMode}
              />
            </div>
            <div
              className="w-full pl-[70px]"
              style={{
                // paddingLeft: sidebarExpanded ? 400 : 70,
                // transition: "padding-left 0.3s",
              }}
            >
              <div className="flex justify-center mx-auto">
                <div className="w-full md:max-w-6xl px-1 py-8">
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
