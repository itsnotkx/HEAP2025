'use client';
import Navigationbar from "@/components/navbar";
import EventCard from "@/components/eventCard";
import { fetchAllEvents } from "../_apis/apis";
import SearchForm from "@/components/FormBox";
import React from "react";
import { mapRawEvent, Event as MappedEvent, RawEvent } from "@/types/Event";

export default function Planner() {
  const [search, setSearch] = React.useState("");
  const [events, setEvents] = React.useState<MappedEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadEvents = async () => {
      try {
        const data: RawEvent[] = await fetchAllEvents();
        setEvents(data.map(mapRawEvent));
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Unable to load events.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <>
      <Navigationbar />
      <SearchForm />

      <section id="event-cards" className="bg-gray-50 min-h-screen py-12 pt-16 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          {loading && <p className="text-center text-gray-500">Loading events...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  className="max-w-xs w-full"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="text-left text-gray-400 py-4">
        © 2025 KiasuPlanner. All rights reserved.
      </footer>
    </>
  );
}
