'use client';

import Navigationbar from "@/components/navbar";
import EventCard from "@/components/PlannerCard";
import SearchForm from "@/components/FormBox";
import { useTimeline } from "@/components/Timeline/TimelineContext";

import { fetchSurpriseMe } from "../api/apis";
import { fetchAllEvents } from "../api/events";
import { mapRawEvent } from "../../types/event";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

// Types
import type { EventType } from "../../types/event";

export default function Planner() {
  const searchParams = useSearchParams();
  const date = searchParams?.get("date") ?? "";
  const surprise = searchParams?.get("surprise") === "true";

  const { addEventToTimeline } = useTimeline();
  const { data: session } = useSession();

  const [events, setEvents] = React.useState<EventType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch all events initially, unless "surprise" is true
  React.useEffect(() => {
    if (!surprise) {
      setLoading(true);
      fetchAllEvents()
        .then((data) => setEvents(data.map(mapRawEvent)))
        .catch(() => setError("Unable to load events."))
        .finally(() => setLoading(false));
    }
  }, [surprise]);

  // Auto-trigger Surprise Me if ?surprise=true&date=YYYY-MM-DD and session is present
  React.useEffect(() => {
    if (surprise && date && session?.user?.id) {
      handleSurpriseMe({
        date,
        startTime: "09:00",
        endTime: "18:00"
      });
    }
    // Only run when these values change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surprise, date, session]);

  const handleAddEvent = (event: EventType) => {
    addEventToTimeline(event);
  };

  // Receives user trigger from SearchForm
  const handleSurpriseMe = async (formData: { date: string; startTime: string; endTime: string }) => {
    setLoading(true);
    setError(null);

    try {
      if (!formData.date || !session?.user?.id) {
        setError("Please log in and select a valid date.");
        return;
      }

      const result = await fetchSurpriseMe({
        formData,
        user_id: session.user.id,
        user_preferences: session.user.preferences
      });

      setEvents(result.selected_events || []);
    } catch (err) {
      setError("An error occurred while fetching Surprise Me events.");
    } finally {
      setLoading(false);
    }
  };

  // To support manual filtering/searching (if SearchForm has this functionality)
  const handleSearchResults = (data: EventType[]) => {
    setEvents(data.map(mapRawEvent));
  };

  return (
    <>
      <Navigationbar />
      <SearchForm
        onSurprise={handleSurpriseMe}
        onSearchResults={handleSearchResults}
        date={date}
      />

      <main className="bg-gray-50 min-h-screen">
        <section id="event-cards" className="py-12 pt-16 mt-16">
          <div className="max-w-6xl mx-auto px-4">
            {loading && (
              <p className="text-center text-gray-500">Loading events...</p>
            )}
            {error && (
              <p className="text-center text-red-500">{error}</p>
            )}
            {!loading && !error && events.length === 0 && (
              <p className="text-center text-gray-400">No events found.</p>
            )}
            {!loading && !error && events.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onAdd={handleAddEvent}
                    className="max-w-xs w-full"
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="text-left text-gray-400 py-4">
        © 2025 KiasuPlanner. All rights reserved.
      </footer>
    </>
  );
}
