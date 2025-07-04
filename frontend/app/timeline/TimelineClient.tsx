"use client";
import React, { useState } from "react";
import Navigationbar from "@/components/navbar";
import SidebarTimeline from "@/components/PopupBar";
import EventCard, { Event } from "@/components/eventCard";

interface TimelineClientProps {
  events: Event[];
  timeSlots: string[];
}

export default function TimelineClient({ events = [], timeSlots }: TimelineClientProps) {
  const [assignedEvents, setAssignedEvents] = useState<Record<string, Event>>({});

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, event: Event) => {
    e.dataTransfer.setData("eventId", event.id as string);
  };

  const handleDropEvent = (eventId: string, time: string) => {
    const event = events.find(ev => ev.id === eventId);
    if (event) {
      setAssignedEvents(prev => ({
        ...prev,
        [time]: event,
      }));
    }
  };

  const assignedIds = Object.values(assignedEvents).map(ev => ev.id);
  const unassignedEvents = (events ?? []).filter(ev => !assignedIds.includes(ev.id));

  return (
    <div className="min-h-screen bg-background flex">
      <SidebarTimeline
        assignedEvents={assignedEvents}
        onDropEvent={handleDropEvent}
        timeSlots={timeSlots}
      />
      <div className="flex-1 flex flex-col">
        <Navigationbar shouldHideOnScroll={false} />
        <main className="max-w-6xl mx-auto px-4 mt-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
            {(unassignedEvents ?? []).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDragStart={handleDragStart}
                className="h-full w-full"
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
