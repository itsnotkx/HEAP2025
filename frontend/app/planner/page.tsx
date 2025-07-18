"use client";

import type { EventType, RawEvent, TravelMode } from "../../types/event";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { fetchAllEvents } from "../api/apis";
import { fetchSurpriseMe } from "../api/apis";
import { mapRawEvent } from "../../types/event";

import Navigationbar from "@/components/navbar";
import EventCard from "@/components/PlannerCard";
import SearchForm from "@/components/FormBox";
import { useTimeline } from "@/components/Timeline/TimelineContext";

// Separate component that uses useSearchParams
function PlannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams?.get("date") ?? "";
  const surprise = searchParams?.get("surprise") === "false";

  const { data: session } = useSession();
  const { addEventToTimeline, setSidebarExpanded } =
    useTimeline(); // expects strict typing

  // State typed correctly for EventType[]
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!surprise) {
      setLoading(true);
      fetchAllEvents()
        .then((data: RawEvent[]) => {
          setEvents(data.map(mapRawEvent));
        })
        .catch(() => setError("Unable to load events."))
        .finally(() => setLoading(false));
    }
  }, [surprise]);

  // useEffect(() => {
  //   if (surprise && date && session?.user?.id) {
  //     handleSurpriseMe({
  //       date,
  //       startTime: "09:00",
  //       endTime: "18:00",
  //     });
  //   }
  // }, [surprise, date, session]);


const handleSurpriseMe = async (formData: {
  date: string;
  startTime: string;
  endTime: string;
}): Promise<void> => {
  setLoading(true);
  setError(null);

  try {
    if (!formData.date || !session?.user?.id) {
      setError("Please log in and select a valid date.");
      setLoading(false);
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      setError("Please enter a valid start and end time");
      setLoading(false);
      return;
    }

    // Fetch surprise events from backend
    const surpriseEvents: EventType[] = await fetchSurpriseMe({
      formData,
      user_id: session.user.id,
      user_preferences: session.user.preferences,
    });

    if (!Array.isArray(surpriseEvents) || surpriseEvents.length === 0) {
      setError("No Surprise Me events returned.");
      setLoading(false);
      return;
    }

    // Add all surprise events one by one, awaiting each addition
    for (const event of surpriseEvents) {
      await addEventToTimeline(event, 60, "transit");
    }

    setSidebarExpanded(true);
  } catch (err) {
    console.error(err);
    setError("An error occurred while fetching Surprise Me events.");
  } finally {
    setLoading(false);
  }
};

  const handleSearchResults = (data: EventType[]) => {
    setEvents(data);
  };

  // Respect TimelineContext typing: duration?: number, mode?: TravelMode
  const handleAddEvent = (event: EventType) => {
    addEventToTimeline(event, 60, "transit"); // explicitly pass mode
  };

  return (
    <div>
      <Navigationbar />

      <SearchForm
        date={date}
        onSearchResults={handleSearchResults}
        onSurprise={handleSurpriseMe}
      />

      <main className="bg-gray-50 min-h-screen">
        <section className="py-12 pt-16 mt-16" id="event-cards">
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
                {events.map((event: EventType) => (
                  <EventCard
                    key={event.id}
                    className="flex flex-col"
                    event={event}
                    onAdd={handleAddEvent}
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
    </div>
  );
}

// Loading fallback component
function PlannerLoading() {
  return (
    <div>
      <Navigationbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-12 pt-16 mt-16">
          <p className="text-center text-gray-500">Loading planner...</p>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function Planner() {
  return (
    <Suspense fallback={<PlannerLoading />}>
      <PlannerContent />
    </Suspense>
  );
}