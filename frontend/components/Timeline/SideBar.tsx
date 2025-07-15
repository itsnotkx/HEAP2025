"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import DayPlanner from "./DayPlanner";
import {EventType} from "../../types/event";
import type { TimelineEntry } from "../../types/event";

type TravelMode = "transit" | "driving" | "walking" | "bicycling";
interface SideBarProps {    
  events: EventType[];
  loading: boolean;
  error: string | null;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  timeline: TimelineEntry[];
  addEventToTimeline: (event: EventType, duration: number, mode: TravelMode) => void;
  mode: TravelMode;
  setMode: (mode: TravelMode) => void;
}

interface DayPlannerProps {
  events: EventType[];
  timeline: TimelineEntry[];
  addEventToTimeline: (event: EventType, duration: number, mode: TravelMode) => void;
  mode: TravelMode;
  setMode: (mode: TravelMode) => void;
}

export default function SideBar({   
  events,
  loading,
  error,
  expanded,
  setExpanded,
  timeline,
  addEventToTimeline,
  mode,
  setMode
}: SideBarProps)  
{
return (
  <div
    className={clsx(
      "transition-all duration-0 bg-white h-100% border-r shadow-md flex flex-col items-center",
      expanded ? "w-[400px]" : "w-[70px]"
    )}
  >
    {expanded && (
      <div className="w-full flex flex-row items-center justify-between px-2 mt-4 mb-4">
          <div className="px-4 pb-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Plan Your Day</h2>
          <p className="text-sm text-gray-500">
            Add events to this planner and create your ideal schedule.
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 border-1 bg-accent hover:bg-accent rounded text-white"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      </div>
    )}
    {!expanded && (
      <div className="w-full flex justify-center mt-6 mb-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 border-1 bg-accent hover:bg-accent rounded text-white"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    )}
  {expanded && <DayPlanner
  events={events}
  timeline={timeline}
  addEventToTimeline={addEventToTimeline}
  mode={mode}
  setMode={setMode}
/>}
  </div>
);
}
