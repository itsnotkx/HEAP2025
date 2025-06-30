"use client";

import { useEffect, useState, useCallback } from "react";
import EventCard from "@/components/eventCard";
import Header from "@/components/header"
import useInfiniteScroll from "@/lib/infiniteScroll";
import { Button } from "@heroui/button";
import { Calendar as CalendarIcon } from "lucide-react";

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
        setEvents(prev => [...prev, ...data.events]);
        setHasMore(data.hasMore);
        setPage(prev => prev + 1);
    }, [page]);

    useEffect(() => {
        loadMoreEvents();
    }, []);

    return (
        <div className="min-h-screen bg-white px-6 py-4">
            {/* Header */}
            <header className="flex justify-between items-center px-8 py-6">
                <Header />
            </header>

            {/* Search Bar */}
            <h2 className="text-center font-medium mb-2">I want to participate in….</h2>
            <div className="flex items-center gap-2 bg-gray-100 rounded-md p-2 mb-6">
                <input
                    type="text"
                    placeholder="Fun family day events"
                    className="bg-transparent w-full outline-none"
                />
                <Button isIconOnly aria-label="calendar" onPress={handleCalendar}>
                    <CalendarIcon/>
                </Button>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
                {events.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>

            {/* Trigger for infinite scroll */}
            <div ref={bottomRef} className="h-10 mt-10" />
        </div>
    );
}
