// 'use client';

/*
import Navigationbar from "@/components/navbar";
import EventCard from "@/components/PlannerCard";
import { fetchAllEvents, fetchFilteredEvents } from "../api/events";
import SearchForm from "@/components/FormBox";
import React, { useState, useContext } from "react";
import {TimelineContext} from "./layout"
import { mapRawEvent } from "../../types/event";




export default function Planner() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Handler for FormBox submission
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFilteredEvents(formData);
      setEvents(data.map(mapRawEvent));
    } catch (err) {
      setError("Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  // Optionally, load all events on first render
  React.useEffect(() => {
    setLoading(true);
    fetchAllEvents()
      .then(data => setEvents(data.map(mapRawEvent)))
      .catch(() => setError("Unable to load events."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navigationbar />
      <SearchForm onSubmit={handleFormSubmit} />

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
*/

'use client';

import { fetchSurpriseMe } from '../api/apis';
import Navigationbar from "@/components/navbar";
import EventCard from "@/components/PlannerCard";
import { fetchAllEvents, fetchFilteredEvents } from "../api/events";
import SearchForm from "@/components/FormBox";
import React, { useState, useContext } from "react";
import { useTimeline, TimelineContext } from "../../components/Timeline/TimelineContext";
import { mapRawEvent } from "../../types/event";
import type { EventType } from "../../types/event"; // <-- Use type alias
import type { TimelineEntry } from "../../types/event";
import { useSession } from "next-auth/react";

export default function Planner() {
  const { addEventToTimeline } = useTimeline();
  const { data: session } = useSession();
  const [events, setEvents] = React.useState<EventType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Handler for FormBox submission
  const handleFormSubmit = async (formData: { date: string; startTime: string; endTime: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFilteredEvents(formData);
      setEvents(data.map(mapRawEvent));
    } catch (err) {
      setError("Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  // Optionally, load all events on first render
  React.useEffect(() => {
    setLoading(true);
    fetchAllEvents()
      .then(data => setEvents(data.map(mapRawEvent)))
      .catch(() => setError("Unable to load events."))
      .finally(() => setLoading(false));
  }, []);

  const handleAddEvent = (event: EventType) => {
    addEventToTimeline(event, Number(null));
  };

  const handleSurpriseMe = async (formData: { date: string; startTime: string; endTime: string }) => {
    setLoading(true);
    setError(null);

    try {
      const { date, startTime, endTime } = formData;

      if (!date || !startTime || !endTime) {
        setError("Please select a date and time range for surprise events.");
        return;
      }

      const starttime = `${date.toString()}T${startTime}`;
      const endtime = `${date.toString()}T${endTime}`;

      const result = await fetchSurpriseMe({
        starttime,
        endtime,
        userId: session?.user?.id || 'guest',
      });

      setEvents(result.selected_events || []);
    } catch (err) {
      setError("Unable to surprise.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigationbar />
      {/*Pass onSurprise to enable Surprise Me button */}
      <SearchForm onSubmit={handleFormSubmit} onSurprise={handleSurpriseMe} />

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
                  onAdd={handleAddEvent}
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
