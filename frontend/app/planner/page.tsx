'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import Navigationbar from "@/components/navbar";
import EventCard from "@/components/PlannerCard";
import SearchForm from "@/components/FormBox";
import { useTimeline } from "@/components/Timeline/TimelineContext";

import { fetchAllEvents } from "../api/events";
import { fetchSurpriseMe } from "../api/apis";
import { mapRawEvent } from "../../types/event";

import type { EventType } from "../../types/event";

export default function Planner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams?.get("date") ?? "";
  const surprise = searchParams?.get("surprise") === "true";

  const { data: session } = useSession();
  const { addEventToTimeline, setSidebarExpanded } = useTimeline(); // ✅ includes sidebar trigger

  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all available events unless surprise flag is set
   */
  useEffect(() => {
    if (!surprise) {
      setLoading(true);
      fetchAllEvents()
        .then((data) => setEvents(data.map(mapRawEvent)))
        .catch(() => setError("Unable to load events."))
        .finally(() => setLoading(false));
    }
  }, [surprise]);

  /**
   * Automatically trigger Surprise Me if flag is set in URL
   */
  useEffect(() => {
    if (surprise && date && session?.user?.id) {
      handleSurpriseMe({
        date,
        startTime: "09:00",
        endTime: "18:00",
      });
    }
  }, [surprise, date, session]);

  /**
   * User-triggered or auto-triggered surprise
   */
  const handleSurpriseMe = async (formData: {
    date: string;
    startTime: string;
    endTime: string;
  }) => {
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
        user_preferences: session.user.preferences,
      });

      const surpriseEvents = result.selected_events || [];

      setEvents(surpriseEvents);

      // Automatically add all events to timeline
      surpriseEvents.forEach((event) => {
        addEventToTimeline(event, 60); // default 60 minutes
      });

      // Automatically expand sidebar
      setSidebarExpanded(true);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching Surprise Me events.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * SearchForm filters
   */
  const handleSearchResults = (data: EventType[]) => {
    setEvents(data.map(mapRawEvent));
  };

  /**
   * Manual event add
   */
  const handleAddEvent = (event: EventType) => {
    addEventToTimeline(event, 60);
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
