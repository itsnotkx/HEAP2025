"use client";
import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Timetable data and logic (same as before)
const timeslots = [
  "8:00 - 9:00",
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
];

const initialEvents = [
  { id: 1, title: "McSpicy Museum", timeslot: "9:00 - 10:00" },
  { id: 2, title: "Find Your Zen", timeslot: "10:00 - 11:00" },
  { id: 3, title: "Hawker Mayhem", timeslot: "11:00 - 12:00" },
  { id: 4, title: "Nintendo Popup", timeslot: "13:00 - 14:00" },
  { id: 5, title: "Shakespeare in the Park", timeslot: "14:00 - 15:00" },
];

const ItemTypes = {
  EVENT: "event",
};

const DraggableEvent = ({ event, index, timeslot, moveEvent, moveToTimeslot }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.EVENT,
    item: { event, fromIndex: index, fromTimeslot: timeslot },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.EVENT,
    hover: (item) => {
      if (item.event.id === event.id) return;
      if (item.fromTimeslot === timeslot) {
        moveEvent(item.fromIndex, index, timeslot);
        item.fromIndex = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`p-3 m-1 bg-primary text-white rounded cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {event.title}
    </div>
  );
};

function Timetable() {
  const [eventsBySlot, setEventsBySlot] = useState(() => {
    const map = Object.fromEntries(timeslots.map((slot) => [slot, []]));
    initialEvents.forEach((event) => {
      map[event.timeslot].push(event);
    });
    return map;
  });

  const moveEvent = (fromIndex, toIndex, timeslot) => {
    setEventsBySlot((prev) => {
      const updated = { ...prev };
      const slotEvents = [...updated[timeslot]];
      const [moved] = slotEvents.splice(fromIndex, 1);
      slotEvents.splice(toIndex, 0, moved);
      updated[timeslot] = slotEvents;
      return updated;
    });
  };

  const moveToTimeslot = (event, fromTimeslot, toTimeslot) => {
    if (fromTimeslot === toTimeslot) return;
    setEventsBySlot((prev) => {
      const updated = { ...prev };
      updated[fromTimeslot] = updated[fromTimeslot].filter((e) => e.id !== event.id);
      updated[toTimeslot] = [...updated[toTimeslot], { ...event, timeslot: toTimeslot }];
      return updated;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="overflow-x-auto py-2">
        <h2 className="text-lg font-bold mb-2">Timetable</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {timeslots.map((slot) => (
            <TimeslotBox
              key={slot}
              slot={slot}
              events={eventsBySlot[slot]}
              moveEvent={moveEvent}
              moveToTimeslot={moveToTimeslot}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

function TimeslotBox({ slot, events, moveEvent, moveToTimeslot }) {
  const [, drop] = useDrop({
    accept: ItemTypes.EVENT,
    drop: (item) => {
      if (item.fromTimeslot !== slot) {
        moveToTimeslot(item.event, item.fromTimeslot, slot);
      }
    },
  });

  return (
    <div
      ref={drop}
      className="border p-2 rounded min-h-[80px] bg-white"
      style={{ minHeight: 80 }}
    >
      <div className="font-semibold mb-1 text-xs">{slot}</div>
      {events.map((event, idx) => (
        <DraggableEvent
          key={event.id}
          event={event}
          index={idx}
          timeslot={slot}
          moveEvent={moveEvent}
          moveToTimeslot={moveToTimeslot}
        />
      ))}
      {events.length === 0 && (
        <div className="text-gray-300 text-xs text-center mt-2">No events</div>
      )}
    </div>
  );
}

export default function PopupBar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`fixed top-16 left-0 w-full z-30 bg-card shadow-md px-4 transition-all duration-300 ${
        collapsed ? "py-1 h-12" : "py-2"
      }`}
      style={{
        height: collapsed ? "2.5rem" : "auto",
        overflow: "hidden",
      }}
    >
      {/* Centered button */}
      <div className="flex justify-center">
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shadow hover:bg-accent transition mt-6 mb-2"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand timetable" : "Collapse timetable"}
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <span className="text-xl">{collapsed ? "▼" : "▲"}</span>
        </button>
      </div>
      {!collapsed && <Timetable />}
    </div>
  );
}
