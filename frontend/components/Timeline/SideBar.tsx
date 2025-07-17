"use client";

import React from "react";
import clsx from "clsx";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

import { useTimeline } from "@/components/Timeline/TimelineContext";
import type { TravelMode } from "../../types/event";

const travelColors = {
  transit: "bg-cyan-100 text-cyan-800 border-cyan-200",
  driving: "bg-orange-100 text-orange-800 border-orange-200",
  walking: "bg-green-100 text-green-800 border-green-200",
  bicycling: "bg-violet-100 text-violet-800 border-violet-200",
};

export default function SideBar({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: (val: boolean) => void;
}) {
  const {
    timeline,
    moveTimelineEntry,
    removeTimelineEntry,
    updateSegmentMode,
  } = useTimeline();

  // Extract only event entries with their timeline index
  const eventItems = timeline
    .map((item, idx) => ({ ...item, timelineIdx: idx }))
    .filter((item) => item.type === "event");

  return (
    <div
      className={clsx(
        "transition-all bg-white min-h-screen border-r shadow-md flex flex-col items-center overflow-y-auto",
        expanded ? "w-[400px]" : "w-[70px]",
      )}
    >
      {/* Collapsed sidebar: right-arrow button */}
      {!expanded && (
        <div className="w-full flex justify-center mt-6 mb-6">
          <button
            aria-label="Expand sidebar"
            className="p-2 bg-accent hover:bg-accent rounded text-white"
            onClick={() => setExpanded(true)}
          >
            <ChevronRightIcon className="w-8 h-8" />
          </button>
        </div>
      )}

      {/* Expanded sidebar */}
      {expanded && (
        <>
          <div className="w-full flex flex-row items-center justify-between px-2 mt-4 mb-4">
            <div className="px-4 pb-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Plan Your Day
              </h2>
              <p className="text-sm text-gray-500">
                Add events to this planner and create your ideal schedule.
              </p>
            </div>
            <button
              aria-label="Collapse sidebar"
              className="p-2 bg-accent hover:bg-accent rounded text-white"
              onClick={() => setExpanded(false)}
            >
              <ChevronLeftIcon className="w-8 h-8" />
            </button>
          </div>

          <div className="flex flex-col gap-4 py-4 px-2 w-full">
            {eventItems.map((eventItem, i) => {
              // Get the next timeline entry (potential travel segment)
              const nextEntry = timeline[eventItem.timelineIdx + 1];
              const isTravelEntry = nextEntry?.type === "travel";
              
              return (
                <React.Fragment key={eventItem.timelineIdx}>
                  {/* --- Event Card --- */}
                  <div className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-teal-400 mr-3 mt-3" />
                    <div className="bg-white rounded-xl shadow px-4 py-3 flex-1 flex items-center min-h-[64px]">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1">
                          <span className="font-semibold text-base">
                            {eventItem.event.title}
                          </span>
                          <button
                            aria-label="Remove"
                            className="ml-2 p-1 rounded-full hover:bg-gray-200 text-gray-400 transition"
                            onClick={() => removeTimelineEntry(i)}
                          >
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          {eventItem.event.address}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center ml-2 gap-1">
                        <button
                          aria-label="Move Up"
                          className="bg-teal-400 hover:bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center mb-1 shadow transition"
                          disabled={i === 0}
                          onClick={() => moveTimelineEntry(i, "up")}
                        >
                          <ChevronUpIcon className="w-4 h-4" />
                        </button>
                        <button
                          aria-label="Move Down"
                          className="bg-rose-400 hover:bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow transition"
                          disabled={i === eventItems.length - 1}
                          onClick={() => moveTimelineEntry(i, "down")}
                        >
                          <ChevronDownIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* --- Transit Dropdown Between Events (show only if corresponding travel exists) --- */}
                  {isTravelEntry && (
                    <div className="flex justify-center items-center">
                      <select
                        className={`rounded-full font-semibold px-3 py-1 text-xs border ${
                          travelColors[
                            nextEntry.mode as keyof typeof travelColors
                          ] || travelColors.transit
                        } focus:outline-none shadow`}
                        style={{ minWidth: 95 }}
                        value={nextEntry.mode}
                        onChange={(e) =>
                          updateSegmentMode(
                            eventItem.timelineIdx + 1,
                            e.target.value as TravelMode,
                          )
                        }
                      >
                        <option value="transit">&#128652; Transit</option>
                        <option value="driving">&#128663; Driving</option>
                        <option value="walking">&#128694; Walking</option>
                        <option value="bicycling">&#128692; Cycling</option>
                      </select>
                      <span className="ml-3 text-gray-500 text-xs">
                        {nextEntry.duration
                          ? `~${nextEntry.duration} min`
                          : ""}
                      </span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}