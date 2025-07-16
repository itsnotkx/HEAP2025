
import React, { createContext, useContext } from "react";
import type { EventType, TimelineEntry } from "../../types/event";

interface TimelineContextType {
  timeline: TimelineEntry[];
  addEventToTimeline: (event: EventType, duration: number) => void;
  moveTimelineEntry: (fromIndex: number, direction:"up" | "down") => void;
  removeTimeLineEntry: (idx: number) => void;
}

export const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (!context) throw new Error("useTimeline must be used within a TimelineProvider");
  return context;
};
