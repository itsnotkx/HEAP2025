import type { EventType, TimelineEntry, TravelMode } from "../../types/event";
import { createContext, useContext } from "react";

export interface TimelineContextType {
  timeline: TimelineEntry[];
  addEventToTimeline: (
    event: EventType,
    duration?: number,
    mode?: TravelMode,
  ) => Promise<void>; // async function returns Promise<void>

  moveTimelineEntry: (
    from: number,
    direction: "up" | "down",
  ) => Promise<void>;

  removeTimelineEntry: (index: number) => Promise<void>;

  setSidebarExpanded: (expanded: boolean) => void;

  updateSegmentMode: (index: number, mode: TravelMode) => Promise<void>;
}

export const TimelineContext = createContext<TimelineContextType | undefined>(
  undefined,
);

export const useTimeline = (): TimelineContextType => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("useTimeline must be used within a TimelineProvider");
  }
  return context;
};
