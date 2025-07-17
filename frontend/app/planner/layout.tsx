"use client";

import type { EventType, TimelineEntry, TravelMode } from "@/types/event";

import React, { useState } from "react";

import SideBar from "@/components/Timeline/SideBar";
import { TimelineContext } from "@/components/Timeline/TimelineContext";
import { getDistanceBetweenVenues } from "@/app/api/apis";

// ModeOverrides associates timeline indices with their travel mode
type ModeOverrides = Record<number, TravelMode>;

export default function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [modeOverrides, setModeOverrides] = useState<ModeOverrides>({});

  // Extract only event entries from the timeline
  const getEventEntries = (): TimelineEntry[] =>
    timeline.filter((entry) => entry.type === "event") as TimelineEntry[];

  // Add an event to the timeline
  const addEventToTimeline = async (
    event: EventType,
    duration = 60,
    mode: TravelMode = "transit",
  ): Promise<void> => {
    setTimeline((prev) => {
      // Extract current events from prev timeline
      const eventsOnly = prev.filter((entry) => entry.type === "event") as TimelineEntry[];

      // Add the new event
      const updatedEvents = [...eventsOnly, { type: "event", event, duration }];

      // Return placeholder timeline while we rebuild
      return updatedEvents;
    });

    // Now rebuild timeline with travel entries
    const rebuiltTimeline = await buildTimelineWithTravel(
      [...getEventEntries(), { type: "event", event, duration }],
      modeOverrides,
    );

    setTimeline(rebuiltTimeline);
  };

  // Move an event up or down within the timeline
  const moveTimelineEntry = async (index: number, direction: "up" | "down") => {
    const eventEntries = getEventEntries();
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= eventEntries.length) return;

    [eventEntries[index], eventEntries[targetIndex]] = [
      eventEntries[targetIndex],
      eventEntries[index],
    ];

    const rebuiltTimeline = await buildTimelineWithTravel(eventEntries, modeOverrides);
    setTimeline(rebuiltTimeline);
  };

  // Remove an event from the timeline
  const removeTimelineEntry = async (index: number): Promise<void> => {
    const eventEntries = getEventEntries();
    if (index < 0 || index >= eventEntries.length) return;

    eventEntries.splice(index, 1);

    const rebuiltTimeline = await buildTimelineWithTravel(eventEntries, modeOverrides);
    setTimeline(rebuiltTimeline);
  };

  // Update mode (transit, walking, etc) for a travel segment
  const updateSegmentMode = async (timelineIndex: number, mode: TravelMode) => {
    const updatedModeOverrides: ModeOverrides = { ...modeOverrides, [timelineIndex]: mode };
    setModeOverrides(updatedModeOverrides);

    const eventEntries = getEventEntries();
    const rebuiltTimeline = await buildTimelineWithTravel(eventEntries, updatedModeOverrides);
    setTimeline(rebuiltTimeline);
  };

  // Constructs a timeline of alternating event and travel entries
  const buildTimelineWithTravel = async (
    eventsOnly: TimelineEntry[],
    overrides: ModeOverrides,
  ): Promise<TimelineEntry[]> => {
    const result: TimelineEntry[] = [];

    for (let i = 0; i < eventsOnly.length; i++) {
      const currentEvent = eventsOnly[i];
      result.push(currentEvent);

      if (i < eventsOnly.length - 1) {
        const from = (currentEvent as any).event.address ?? "";
        const to = (eventsOnly[i + 1] as any).event.address ?? "";
        const travelIndex = result.length;
        const mode = overrides[travelIndex] ?? "transit";

        try {
          const { duration } = await getDistanceBetweenVenues(from, to, mode);
          result.push({
            type: "travel",
            from,
            to,
            duration,
            mode,
          });
        } catch {
          result.push({
            type: "travel",
            from,
            to,
            duration: 0,
            mode,
          });
        }
      }
    }

    return result;
  };

  return (
    <TimelineContext.Provider
      value={{
        timeline,
        addEventToTimeline,
        moveTimelineEntry,
        removeTimelineEntry,
        setSidebarExpanded,
        updateSegmentMode,
      }}
    >
      <div className="flex">
        <aside
          className="fixed left-0 top-[60px] h-screen z-20 bg-white border-r transition-all overflow-y-auto"
          style={{ width: sidebarExpanded ? 400 : 70 }}
        >
          <SideBar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
        </aside>
        <main className="w-full pl-[70px] px-6 pt-[60px]">{children}</main>
      </div>
    </TimelineContext.Provider>
  );
}
