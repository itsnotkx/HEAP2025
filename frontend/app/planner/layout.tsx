"use client";
import "@/styles/globals.css";

import clsx from "clsx";
import NavigationBar from "@/components/navbar";
import SideBar from "@/components/Timeline/SideBar";

import { Providers } from "@/app/providers";

import { fontSans } from "@/config/fonts";

import React, { createContext, useState, useEffect } from "react";

import type { EventType, TimelineEntry } from "../../types/event";
import { getDistanceBetweenVenues } from "../api/apis";

import { TimelineContext } from "../../components/Timeline/TimelineContext";

import { useSearchParams } from "next/navigation";
import { IdentificationIcon } from "@heroicons/react/24/solid";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mode, setMode] = useState<
    "Transit" | "driving" | "walking" | "bicycling"
  >("Transit");
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);

  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  const addEventToTimeline = async (
    event: EventType,
    duration: number,
    modeParam: "Transit" | "driving" | "walking" | "bicycling" = "Transit"
  ) => {
    const prevTimeline = timeline;
    const newTimeline = [...prevTimeline];

    const lastEventEntry = [...prevTimeline]
      .reverse()
      .find((entry) => entry.type === "event") as
      | { type: "event"; event: EventType; duration: number }
      | undefined;

    if (lastEventEntry) {
      try {
        const { duration: travelDuration } = await getDistanceBetweenVenues(
          lastEventEntry.event.address,
          event.address,
          modeParam // Use the selected mode here
        );
        newTimeline.push({
          type: "travel",
          from: lastEventEntry.event.address,
          to: event.address,
          duration: travelDuration,
        });
      } catch (err) {
        console.error("Failed to fetch travel duration", err);
      }
    }

    newTimeline.push({
      type: "event",
      event,
      duration,
    });

    setTimeline(newTimeline);
  };

  const buildTimelineWithTravel = async (
    entries,
    modeParam: "Transit" | "driving" | "walking" | "bicycling" = "Transit"
  ): Promise<TimelineEntry[]> => {
    console.log("Building timeline with travel for entries:", entries);
    const timeline: TimelineEntry[] = [];
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].type !== "event") {
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
          };

          timeline.push(travelEntry);
        } catch (err) {
          console.error(
            `Failed to get travel time between ${currentEvent.address} and ${
              events[i + 1].address
            }`,
            err
          );
        }
      }
    }

    return timeline;
  };

  const moveTimelineEntry = async (idx: number, direction: "up" | "down") => {
    console.log("moveTimelineEntry", idx, direction);
    if (idx < 0 || idx > timeline.length - 1) return;
    const tempTimeline = [...timeline];
    let startIdx = 0;
    let endIdx = tempTimeline.length - 1;
    if (direction === "up") {
      if (idx === 0) return;
      startIdx = idx - 4;
      endIdx = idx + 2;
    } else if (direction === "down") {
      if (idx === tempTimeline.length - 1) return;
      startIdx = idx - 2;
      endIdx = idx + 4;
    }
    startIdx = Math.max(startIdx, 0);
    endIdx = Math.min(endIdx, tempTimeline.length - 1);
    const toRebuild: TimelineEntry[] = [];
    let miniIdx = 0;
    for (let i = startIdx; i <= endIdx; i++) {
      const entry = tempTimeline[i];
      if (entry == null || entry.type !== "event") continue;
      toRebuild.push(entry);
      if (i === idx) {
        miniIdx = toRebuild.length - 1; // relative index in toRebuild
      }
    }
     // Swap with element above
    // console.log("Swapping up", miniIdx, toRebuild[miniIdx], toRebuild[miniIdx - 1]);
    const undefRemoved = toRebuild.filter((item) => item !== undefined);
    console.log("undefRemoved", undefRemoved);
    if (direction === "up" && miniIdx > 0) {
      // Swap with element above
      console.log(
        "Swapping up",
        miniIdx,
        undefRemoved[miniIdx],
        undefRemoved[miniIdx - 1]
      );
      [undefRemoved[miniIdx], undefRemoved[miniIdx - 1]] = [
        undefRemoved[miniIdx - 1],
        undefRemoved[miniIdx],
      ];
    } else if (direction === "down" && miniIdx < undefRemoved.length - 1) {
      // Swap with element below
      [undefRemoved[miniIdx], undefRemoved[miniIdx + 1]] = [
        undefRemoved[miniIdx + 1],
        undefRemoved[miniIdx],
      ];
    }

    const rebuilt = await buildTimelineWithTravel(undefRemoved, mode);

    const newTimeline = [
      ...timeline.slice(0, startIdx),
      ...rebuilt,
      ...timeline.slice(endIdx + 1),
    ];

    setTimeline((prev) => newTimeline);
    console.log("old timeline", timeline);
    console.log("new timeline", newTimeline);
  };

  return (
    <TimelineContext.Provider
      value={{ timeline, addEventToTimeline, moveTimelineEntry }}
    >
      <div
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <NavigationBar shouldHideOnScroll={false} />
          <div className="relative">
            <div className="flex">
              <div
                className="fixed left-0 top-[60px] h-[calc(100%)] border-r bg-white overflow-y-auto z-20"
                style={{
                  width: sidebarExpanded ? 400 : 70,
                  transition: "width 0.1s",
                }}
              >
                <SideBar
                  events={events}
                  loading={loading}
                  error={error}
                  expanded={sidebarExpanded}
                  setExpanded={setSidebarExpanded}
                  timeline={timeline}
                  addEventToTimeline={(event, duration, modeParam) =>
                    addEventToTimeline(event, duration, modeParam)
                  }
                  mode={mode}
                  setMode={setMode}
                />
              </div>
              <div className="w-full pl-[70px]">
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
  );
}
