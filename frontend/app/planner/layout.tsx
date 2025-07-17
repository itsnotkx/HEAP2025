"use client";

import type { EventType, TimelineEntry } from "@/types/event";

import React, { useState } from "react";

import SideBar from "@/components/Timeline/SideBar";
import { TimelineContext } from "@/components/Timeline/TimelineContext";
import { getDistanceBetweenVenues } from "@/app/api/apis";

export default function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [modeOverrides, setModeOverrides] = useState<Record<number, string>>(
    {},
  );

  // Helper: get just event entries
  const getEventEntries = () =>
    timeline.filter((e) => e.type === "event") as TimelineEntry[];

  // Add event
  const addEventToTimeline = async (
    event: EventType,
    duration = 60,
    defaultMode = "transit",
  ) => {
    const eventEntries = getEventEntries();

    eventEntries.push({ type: "event", event, duration } as TimelineEntry);
    const rebuilt = await buildTimelineWithTravel(eventEntries, modeOverrides);

    setTimeline(rebuilt);
  };

  // Move event
  const moveTimelineEntry = async (index: number, direction: "up" | "down") => {
    const eventEntries = getEventEntries();
    const target = direction === "up" ? index - 1 : index + 1;

    if (target < 0 || target >= eventEntries.length) return;
    [eventEntries[index], eventEntries[target]] = [
      eventEntries[target],
      eventEntries[index],
    ];
    const rebuilt = await buildTimelineWithTravel(eventEntries, modeOverrides);

    setTimeline(rebuilt);
  };

  // Remove event
  const removeTimeLineEntry = async (index: number) => {
    const eventEntries = getEventEntries();

    if (index < 0 || index > eventEntries.length - 1) return;
    eventEntries.splice(index, 1);
    const rebuilt = await buildTimelineWithTravel(eventEntries, modeOverrides);

    setTimeline(rebuilt);
  };

  // 🔑 Update mode for **this travel segment (timeline index, not event index!)**
  const updateSegmentMode = async (timelineIndex: number, mode: string) => {
    const updated = { ...modeOverrides, [timelineIndex]: mode };

    setModeOverrides(updated);

    // 🎯 Always build from events only, not the timeline-with-travels
    const eventEntries = getEventEntries();
    const rebuilt = await buildTimelineWithTravel(eventEntries, updated);

    setTimeline(rebuilt);
  };

  // This is the magic: build a [event, travel, event, ...] timeline, so each travel segment
  // can be identified by its own index, matching the rendered dropdown!
  const buildTimelineWithTravel = async (
    eventsOnly: TimelineEntry[], // Only events!
    overrides: Record<number, string>,
  ): Promise<TimelineEntry[]> => {
    const result: TimelineEntry[] = [];
    let travelTimelineIdx = 0;

    for (let i = 0; i < eventsOnly.length; i++) {
      const current = eventsOnly[i];

      result.push(current);
      if (i < eventsOnly.length - 1) {
        const from = (current as any).event.address;
        const to = (eventsOnly[i + 1] as any).event.address;
        // The trick: use the precise index the segment will have in result
        // It's always the current result.length (i.e. the next element)
        const actualTravelIdx = result.length;
        const mode = overrides[actualTravelIdx] || "transit";

        try {
          const { duration } = await getDistanceBetweenVenues(from, to, mode);

          result.push({
            type: "travel",
            from,
            to,
            duration,
            mode,
          });
        } catch (err) {
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
        removeTimeLineEntry,
        setSidebarExpanded,
        updateSegmentMode,
      }}
    >
      <div className="flex">
        <aside
          className="fixed left-0 top-[60px] h-screen z-20 bg-white border-r transition-all overflow-y-auto"
          style={{ width: sidebarExpanded ? 400 : 70 }}
        >
          <SideBar
            expanded={sidebarExpanded}
            setExpanded={setSidebarExpanded}
          />
        </aside>
        <main className="w-full pl-[70px] px-6 pt-[60px]">{children}</main>
      </div>
    </TimelineContext.Provider>
  );
}
