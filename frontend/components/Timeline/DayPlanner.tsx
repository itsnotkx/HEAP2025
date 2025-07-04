"use client";
import React, { useState } from "react";
import { Rnd } from "react-rnd";

const HOUR_HEIGHT = 60; // 60px per hour
const SNAP_INTERVAL = 15; // minutes
const PIXELS_PER_MINUTE = HOUR_HEIGHT / 60; // 1px = 1 minute
const START_HOUR = 8;
const END_HOUR = 23;
const MIN_EVENT_DURATION = 0.5;

const snapToGrid = (value) =>
  Math.round(value / (SNAP_INTERVAL * PIXELS_PER_MINUTE)) *
  (SNAP_INTERVAL * PIXELS_PER_MINUTE);

const initialEvents = [
  { id: 1, title: "Meeting", start: 9, end: 10 },
  { id: 2, title: "Work Session", start: 11, end: 12 },
];

interface DayPlannerProps {
  fromHour?: number;
  toHour?: number;
}

export default function DayPlanner({
  fromHour = 8,
  toHour = 17,
}: DayPlannerProps) {
  const [events, setEvents] = useState(initialEvents);
  const [flashingId, setFlashingId] = useState<number | null>(null);

  const isColliding = (id, newStart, newEnd) => {
    if (newStart < fromHour || newEnd > toHour) return true;
    return events.some(
      (ev) =>
        ev.id !== id && Math.max(ev.start, newStart) < Math.min(ev.end, newEnd)
    );
  };

  const flashEvent = (eventId: number) => {
    setFlashingId(eventId);
    setTimeout(() => setFlashingId(null), 400); // 400ms flash
  };

  const handleDragStop = (e, d, eventId) => {
    const y = snapToGrid(d.y);
    const newStart = START_HOUR + y / HOUR_HEIGHT;

    const currentEvent = events.find((ev) => ev.id === eventId);
    const duration = currentEvent.end - currentEvent.start;
    const newEnd = newStart + duration;

    if (isColliding(eventId, newStart, newEnd)) {
      flashEvent(eventId);
      return;
    }

    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId ? { ...ev, start: newStart, end: newEnd } : ev
      )
    );
  };

  const handleResizeStop = (e, dir, ref, delta, position, eventId) => {
    const currentEvent = events.find((ev) => ev.id === eventId);
    const newHeight = snapToGrid(ref.offsetHeight);

    let newStart = currentEvent.start;
    let newEnd = currentEvent.end;

    if (dir === "top") {
      // Calculate new start time
      newStart = currentEvent.end - newHeight / HOUR_HEIGHT;
      // Enforce minimum duration
      if (currentEvent.end - newStart < MIN_EVENT_DURATION) {
        newStart = currentEvent.end - MIN_EVENT_DURATION;
      }
    } else if (dir === "bottom") {
      // Calculate new end time
      newEnd = currentEvent.start + newHeight / HOUR_HEIGHT;
      // Enforce minimum duration
      if (newEnd - currentEvent.start < MIN_EVENT_DURATION) {
        newEnd = currentEvent.start + MIN_EVENT_DURATION;
      }
    }
    if (isColliding(eventId, currentEvent.start, newEnd)) {
      flashEvent(eventId);
      return;
    }

    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, end: newEnd } : ev))
    );
  };

  return (
    <div className="flex h-full w-full overflow-y-auto">
      {/* Time Labels */}
      <div className="w-20 flex flex-col items-end pr-2 text-sm text-gray-600">
        {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => (
          <div
            key={i}
            className="h-[60px] w-16 border-t border-gray-300 pr-1 leading-[60px] text-center"
          >
            {START_HOUR + i}:00
          </div>
        ))}
      </div>
      {/* Day Timeline */}
      <div className="relative flex-1 border-l border-gray-300 bg-white">
        {/* Greyed out hours */}
        {fromHour > START_HOUR && (
          <div
            className="absolute left-0 right-0 bg-gray-200 opacity-60 pointer-events-none z-10"
            style={{
              top: 0,
              height: (fromHour - START_HOUR) * HOUR_HEIGHT,
            }}
          />
        )}
        {toHour < END_HOUR && (
          <div
            className="absolute left-0 right-0 bg-gray-200 opacity-60 pointer-events-none z-10"
            style={{
              top: (toHour - START_HOUR) * HOUR_HEIGHT,
              height: (END_HOUR - toHour) * HOUR_HEIGHT,
            }}
          />
        )}
        {/* Grid Lines */}
        {Array.from(
          { length: (END_HOUR - START_HOUR) * (60 / SNAP_INTERVAL) },
          (_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-gray-100"
              style={{ top: i * (SNAP_INTERVAL * PIXELS_PER_MINUTE) }}
            />
          )
        )}
        {/* Events */}
        {events.map((ev) => {
          const top = (ev.start - START_HOUR) * HOUR_HEIGHT;
          const height = (ev.end - ev.start) * HOUR_HEIGHT;

          const formatTime = (hourFloat: number) => {
            const hour = Math.floor(hourFloat);
            const minute = Math.round((hourFloat - hour) * 60);
            return `${hour.toString().padStart(2, "0")}:${minute
              .toString()
              .padStart(2, "0")}`;
          };
          const isCompressed = height <= 30;

          return (
            <Rnd
              key={ev.id}
              size={{ width: "100%", height }}
              position={{ x: 0, y: top }}
              bounds="parent"
              enableResizing={{
                top: true,
                right: false,
                bottom: true,
                left: false,
              }}
              dragAxis="y"
              onDragStop={(e, d) => handleDragStop(e, d, ev.id)}
              onResizeStop={(e, dir, ref, delta, position) =>
                handleResizeStop(e, dir, ref, delta, position, ev.id)
              }
              className={`absolute p-2 text-sm rounded-md shadow-md cursor-pointer select-none transition-colors duration-200
        ${
          flashingId === ev.id
            ? "bg-red-500 text-white"
            : "bg-primary text-white"
        }
      `}
              dragGrid={[1, SNAP_INTERVAL * PIXELS_PER_MINUTE]}
              resizeGrid={[2, SNAP_INTERVAL * PIXELS_PER_MINUTE]}
            >
              <div
                className={`flex ${
                  isCompressed ? "flex-row items-center  gap-2" : "flex-col"
                }`}
              >
                {" "}
                <span className="font-semibold">{ev.title}</span>
                <span className="text-xs opacity-80">
                  {formatTime(ev.start)} - {formatTime(ev.end)}
                </span>
              </div>
            </Rnd>
          );
        })}
      </div>
    </div>
  );
}
