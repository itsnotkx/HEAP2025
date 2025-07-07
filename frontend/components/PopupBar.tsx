
"use client";
import React from "react";

export default function PopupBar() {
  return (
    <div
      className="fixed left-0 w-full z-40 bg-blue-100 border-b-2 border-blue-300"
      style={{ top: "4rem", height: "25vh" }} // 4rem = navbar height
    >
      <div className="flex items-center justify-center h-full">
        <span className="text-xl font-bold text-blue-600">
          Drag and Drop into timing
        </span>
      </div>
    </div>
  );
}
