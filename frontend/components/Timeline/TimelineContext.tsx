import { createContext, useContext } from "react";
import type { EventType, TimelineEntry } from "../../types/event";

export interface TimelineContextType {
  timeline: TimelineEntry[];
  addEventToTimeline: (
    event: EventType,
    duration?: number,
    mode?: string
  ) => void;
  moveTimelineEntry: (from: number, direction: "up" | "down") => void;
  removeTimeLineEntry: (index: number) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  updateSegmentMode: (index: number, mode: string) => void;
}

export const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (!context) throw new Error("useTimeline must be used within a TimelineProvider");
  return context;
};
