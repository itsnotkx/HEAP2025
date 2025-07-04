"use client";
import React, { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// --- Types ---
type PoolItem = {
  id: string | number;
  type: "event" | "car" | "eat";
  title?: string;
};

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

// Example events included in initialEvents
const initialEvents: PoolItem[] = [
  { id: 1, type: "event", title: "McSpicy Museum" },
  { id: 2, type: "event", title: "Find Your Zen" },
  { id: 3, type: "event", title: "Hawker Mayhem" },
  { id: 4, type: "event", title: "Nintendo Popup" },
  { id: 5, type: "event", title: "Shakespeare in the Park" },
];

// --- Car Icon ---
const CarIcon = () => (
  <svg width={28} height={28} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 13l1-3h16l1 3v6a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H6v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm2.16-4l.84-2.5A2 2 0 017.83 5h8.34a2 2 0 011.83 1.5L18.84 9H5.16zM7 16a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);

// --- Cutlery Icon ---
const EatIcon = () => (
  <svg width={28} height={28} fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 2a1 1 0 00-1 1v8.28a2 2 0 001.55 1.94l1.45.36V21a1 1 0 002 0v-7.42l1.45-.36A2 2 0 0018 11.28V3a1 1 0 00-2 0v8.28a.5.5 0 01-.39.48l-1.61.4V3a1 1 0 00-2 0v9.16l-1.61-.4A.5.5 0 017 11.28V3zm9 11a1 1 0 011 1v7a1 1 0 01-2 0v-7a1 1 0 011-1z" />
  </svg>
);

const ItemTypes = {
  EVENT: "event",
  CAR_TEMPLATE: "car_template",
  EAT_TEMPLATE: "eat_template",
};

// --- Persistent Draggable Car Template ---
const CarPoolTemplate: React.FC = () => {
  const [, drag] = useDrag({ type: ItemTypes.CAR_TEMPLATE, item: { type: "car_template" } });
  return (
    <div
      ref={drag}
      className="p-3 m-1 bg-primary text-white rounded cursor-move font-semibold shadow flex items-center justify-center"
      style={{ minWidth: 36, minHeight: 36 }}
      title="Transport"
    >
      <CarIcon />
    </div>
  );
};

// --- Persistent Draggable Eat Template ---
const EatPoolTemplate: React.FC = () => {
  const [, drag] = useDrag({ type: ItemTypes.EAT_TEMPLATE, item: { type: "eat_template" } });
  return (
    <div
      ref={drag}
      className="p-3 m-1 bg-accent text-white rounded cursor-move font-semibold shadow flex items-center justify-center"
      style={{ minWidth: 36, minHeight: 36 }}
      title="Eat"
    >
      <EatIcon />
    </div>
  );
};

// --- Draggable Event Card (for timeslots) ---
const DraggableEvent: React.FC<{
  event: PoolItem;
  index: number;
  timeslot: string;
  moveEvent: (fromIndex: number, toIndex: number, timeslot: string) => void;
  moveToTimeslot: (event: PoolItem, fromTimeslot: string | null, toTimeslot: string) => void;
  moveToPool: (event: PoolItem, fromTimeslot: string) => void;
}> = ({ event, index, timeslot, moveEvent, moveToTimeslot, moveToPool }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.EVENT,
    item: { event, fromIndex: index, fromTimeslot: timeslot },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.EVENT,
    hover: (item: any) => {
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
      className={`p-3 m-1 bg-primary text-primary-foreground rounded cursor-move font-semibold shadow flex items-center
        ${isDragging ? "opacity-50" : "opacity-100"}`}
      style={{ minHeight: 36, minWidth: 36 }}
    >
      {event.type === "car" ? <CarIcon /> : event.type === "eat" ? <EatIcon /> : event.title}
      <button
        className="ml-2 px-2 py-1 rounded bg-accent text-white text-xs hover:bg-primary transition"
        onClick={() => moveToPool(event, timeslot)}
        aria-label="Remove from slot"
      >
        ×
      </button>
    </div>
  );
};

// --- Draggable Event Card for the pool (unassigned) ---
const PoolEventCard: React.FC<{ event: PoolItem }> = ({ event }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.EVENT,
    item: { event, fromIndex: null, fromTimeslot: null },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <div
      ref={drag}
      className={`p-3 m-1 bg-accent text-white rounded cursor-move font-semibold shadow flex items-center
        ${isDragging ? "opacity-50" : "opacity-100"}`}
      style={{ minHeight: 36, minWidth: 36 }}
    >
      {event.type === "car" ? <CarIcon /> : event.type === "eat" ? <EatIcon /> : event.title}
    </div>
  );
};

// --- Timetable ---
function Timetable() {
  const [eventsBySlot, setEventsBySlot] = useState<Record<string, PoolItem[]>>(() => {
    const map = Object.fromEntries(timeslots.map((slot) => [slot, [] as PoolItem[]]));
    return map;
  });

  const [poolItems, setPoolItems] = useState<PoolItem[]>([...initialEvents]);
  const carIdCounter = useRef(1);
  const eatIdCounter = useRef(1);

  // Move within a timeslot
  const moveEvent = (fromIndex: number, toIndex: number, timeslot: string) => {
    setEventsBySlot((prev) => {
      const updated = { ...prev };
      const slotEvents = [...updated[timeslot]];
      const [moved] = slotEvents.splice(fromIndex, 1);
      slotEvents.splice(toIndex, 0, moved);
      updated[timeslot] = slotEvents;
      return updated;
    });
  };

  // Move from pool to a timeslot, or between timeslots
  const moveToTimeslot = (event: PoolItem, fromTimeslot: string | null, toTimeslot: string) => {
    if (fromTimeslot === toTimeslot) return;
    setEventsBySlot((prev) => {
      const updated = { ...prev };
      if (fromTimeslot) {
        updated[fromTimeslot] = updated[fromTimeslot].filter((e) => e.id !== event.id);
      } else {
        setPoolItems((pool) => pool.filter((e) => e.id !== event.id));
      }
      updated[toTimeslot] = [...updated[toTimeslot], { ...event }];
      return updated;
    });
  };

  // Move from timeslot back to pool
  const moveToPool = (event: PoolItem, fromTimeslot: string) => {
    setEventsBySlot((prev) => {
      const updated = { ...prev };
      updated[fromTimeslot] = updated[fromTimeslot].filter((e) => e.id !== event.id);
      return updated;
    });
    setPoolItems((pool) => [...pool, { ...event }]);
  };

  // Handle dropping the car template into a slot
  const handleDropCarTemplate = (slot: string) => {
    const newCar = {
      id: `car-${carIdCounter.current++}`,
      type: "car" as const,
      title: "Transport",
    };
    setEventsBySlot((prev) => ({
      ...prev,
      [slot]: [...prev[slot], newCar],
    }));
  };

  // Handle dropping the eat template into a slot
  const handleDropEatTemplate = (slot: string) => {
    const newEat = {
      id: `eat-${eatIdCounter.current++}`,
      type: "eat" as const,
      title: "Eat",
    };
    setEventsBySlot((prev) => ({
      ...prev,
      [slot]: [...prev[slot], newEat],
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="overflow-x-auto py-2" style={{ maxHeight: "60vh", overflowY: "auto" }}>
        {/* Pool of unassigned events */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Event Pool</h2>
          <div className="flex flex-wrap gap-2 bg-background border border-border rounded p-2 min-h-[56px]">
            <CarPoolTemplate />
            <EatPoolTemplate />
            {poolItems.length === 0 && (
              <div className="text-gray-300 text-xs text-center m-2">No unassigned events</div>
            )}
            {poolItems.map((item) => (
              <PoolEventCard key={item.id} event={item} />
            ))}
          </div>
        </div>
        <h2 className="text-lg font-bold mb-2">Timetable</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {timeslots.map((slot) => (
            <TimeslotBox
              key={slot}
              slot={slot}
              events={eventsBySlot[slot]}
              moveEvent={moveEvent}
              moveToTimeslot={moveToTimeslot}
              moveToPool={moveToPool}
              onDropCarTemplate={handleDropCarTemplate}
              onDropEatTemplate={handleDropEatTemplate}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

// --- Timeslot Box ---
function TimeslotBox({
  slot,
  events,
  moveEvent,
  moveToTimeslot,
  moveToPool,
  onDropCarTemplate,
  onDropEatTemplate,
}: {
  slot: string;
  events: PoolItem[];
  moveEvent: (fromIndex: number, toIndex: number, timeslot: string) => void;
  moveToTimeslot: (event: PoolItem, fromTimeslot: string | null, toTimeslot: string) => void;
  moveToPool: (event: PoolItem, fromTimeslot: string) => void;
  onDropCarTemplate: (slot: string) => void;
  onDropEatTemplate: (slot: string) => void;
}) {
  const [, drop] = useDrop({
    accept: [ItemTypes.EVENT, ItemTypes.CAR_TEMPLATE, ItemTypes.EAT_TEMPLATE],
    drop: (item: any) => {
      if (item.type === "car_template") {
        onDropCarTemplate(slot);
      } else if (item.type === "eat_template") {
        onDropEatTemplate(slot);
      } else if (item.fromTimeslot !== slot) {
        moveToTimeslot(item.event, item.fromTimeslot, slot);
      }
    },
  });

  return (
    <div
      ref={drop}
      className="border p-2 rounded min-h-[100px] bg-card flex flex-col"
      style={{ minHeight: 100 }}
    >
      <div className="font-semibold mb-1 text-xs text-secondary">{slot}</div>
      {events.map((event, idx) => (
        <DraggableEvent
          key={event.id}
          event={event}
          index={idx}
          timeslot={slot}
          moveEvent={moveEvent}
          moveToTimeslot={moveToTimeslot}
          moveToPool={moveToPool}
        />
      ))}
      {events.length === 0 && (
        <div className="text-gray-300 text-xs text-center mt-2">Drop Here</div>
      )}
    </div>
  );
}

// --- Collapsible PopupBar Wrapper ---
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
      {/* Centered collapse/expand button */}
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
