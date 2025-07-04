"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import DayPlanner from "./DayPlanner";

export default function SideBar({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
}) {
return (
  <div
    className={clsx(
      "transition-all duration-0 bg-white h-full border-r shadow-md flex flex-col items-center",
      expanded ? "w-[400px]" : "w-[70px]"
    )}
  >
    {expanded && (
      <div className="w-full flex flex-row items-center justify-between px-2 mt-4 mb-4">
        <div className="">
        <h1 className="text-l font-bold">Plan your day! </h1>
        <p>Drag and drop events into this sidebar.</p>
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
    {expanded && <DayPlanner />}
  </div>
);
}
