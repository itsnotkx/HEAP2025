"use client";

import React from "react";

const TIMES = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"
];

export default function TimelineBar() {
  return (
    <div className="w-full bg-white shadow rounded-lg px-6 py-4 flex items-center justify-center">
      <div className="flex gap-4 w-full">
        {TIMES.map((time) => (
          <div
            key={time}
            className="flex-1 flex flex-col items-center"
          >
            <div className="text-xs font-semibold text-gray-500 mb-2">{time}</div>
            {/* Drop area for events */}
            <div className="w-full h-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center transition-colors hover:border-blue-400">
              <span className="text-gray-400 text-xs">Drop Here</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
