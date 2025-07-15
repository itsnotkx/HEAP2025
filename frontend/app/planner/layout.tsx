"use client";
import "@/styles/globals.css";
import next, { Metadata, Viewport } from "next";

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

import { useSearchParams } from "next/navigation";
import { time } from "console";
import { start } from "repl";



export default function RootLayout({ children }: { children: React.ReactNode }) {

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mode, setMode] = useState<"Transit" | "driving" | "walking" | "bicycling">("Transit");
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);


  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const date = searchParams?.get("date") ?? ""; 



  const addEventToTimeline = async (
  event: EventType,
  duration: number,
  modeParam: "Transit" | "driving" | "walking" | "bicycling" = "Transit"
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

const buildTimelineWithTravel = async (
  entries,
  modeParam: "Transit" | "driving" | "walking" | "bicycling" = "Transit"
): Promise<TimelineEntry[]> => {
  const timeline: TimelineEntry[] = [];
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].type !== 'event') {
      continue;
    }
    const currentEvent = entries[i].event;

    // Insert the current event
    timeline.push({
      type: "event",
      event: currentEvent,
      duration: null,
    });

    // If there's a next event, compute travel
    if (i < entries.length - 1) {
      try {
        const { duration: travelDuration } = await getDistanceBetweenVenues(
          currentEvent.address,
          entries[i + 1].event.address,
          mode
        );
        const travelEntry: TimelineEntry = {
          type: "travel",
          from: currentEvent.address,
          to: entries[i + 1].event.address,
          duration: travelDuration,
        }

        timeline.push(travelEntry);
      } catch (err) {
        console.error(`Failed to get travel time between ${currentEvent.address} and ${events[i + 1].address}`, err);
      }
    }
  }

  return timeline;
};

  const moveTimelineEntry = async(idx: number, direction:"up" | "down") => {
    console.log("Moving entry from", idx, "direction", direction);
    if (idx < 0 || idx > timeline.length - 1) return;
    const tempTimeline = [...timeline];
    let startIdx = 0;
    let endIdx = tempTimeline.length - 1;
    if(direction === "up") {
      if (idx === 0) return; 
      startIdx = idx - 4;
      endIdx = idx + 2;
    }
    else if(direction === "down") {
      if (idx === tempTimeline.length - 1) return; 
      startIdx = idx - 2;
      endIdx = idx + 4;
    }
    startIdx = Math.max(startIdx, 0);
    endIdx = Math.min(endIdx, tempTimeline.length - 1);
    const toRebuild: TimelineEntry[] = [];
    for(let i = startIdx; i <= endIdx; i++) {
      if(tempTimeline[i].type === "event") {
        toRebuild.push(tempTimeline[i]);
      }
    }
    
    console.log("toRebuild", toRebuild);

    const rebuilt = await buildTimelineWithTravel(toRebuild, mode);
    console.log("rebuilt", rebuilt);
    
    tempTimeline.splice(startIdx, rebuilt.length,...rebuilt);
    console.log("old timeline", timeline);

    console.log("new timeline", tempTimeline);
    // const updated = recalculateTravelTimes(newTimeline);
    setTimeline(tempTimeline);
  };



  return (
    <TimelineContext.Provider value={{ timeline, addEventToTimeline,  moveTimelineEntry}}>
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
                moveTimelineEntry={moveTimelineEntry}
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
