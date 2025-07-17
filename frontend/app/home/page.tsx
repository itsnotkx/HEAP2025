"use client";

import { useEffect, useState, useCallback } from "react";

import EventCard from "@/components/eventCard";
import NavigationBar from "@/components/navbar";
import useInfiniteScroll from "@/utils/infiniteScroll";

type Event = {
  id: string;
  title: string;
  location: string;
  rating: number;
  tags: string[];
  imageUrl: string;
};

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const bottomRef = useInfiniteScroll(() => {
    if (hasMore) loadMoreEvents();
  });

  const loadMoreEvents = useCallback(async () => {
    const res = await fetch(`/api/events?page=${page}`);
    const data = await res.json();

    setEvents((prev) => [...prev, ...data.events]);
    setHasMore(data.hasMore);
    setPage((prev) => prev + 1);
  }, [page]);

  useEffect(() => {
    loadMoreEvents();
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-4">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6">
        <NavigationBar />
      </header>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Trigger for infinite scroll */}
      <div ref={bottomRef} className="h-10 mt-10" />
    </div>
  );
}
