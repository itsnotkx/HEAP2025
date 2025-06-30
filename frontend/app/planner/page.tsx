"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import SearchForm from "../../components/FormBox";
import Navigationbar from "@/components/navbar";
import EventCard from '@/components/eventCard';


export default function Planner() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const events: Event[] = [
    {
      id: "1",
      Title: "Kebaya Catwalk vending machines",
      "Start Date": "2025-05-01",
      "End Date": "2025-05-19",
      Time: "10:00 AM - 9:00 PM",
      "Address / Location": "Bukit Panjang Plaza",
      "Postal Code": "670123",
      Category: "Heritage",
      "Price / Ticket Info": "Free",
      Description:
        "Now till 19th May. View this post on Instagram. A post shared by National Heritage Board (@nhb_sg). Heads up,...",
      "Image URL(s)": [
        "https://i.imgur.com/rd7sWl5.png", // replace with real or static image
      ],
      Organizer: "National Heritage Board",
      "Official Event Link": "https://www.instagram.com/p/abc123/",
      url: [],
    },
    {
      id: "2",
      Title: "National Day Parade Rehearsal",
      "Start Date": "2025-07-13",
      "End Date": "2025-07-13",
      Time: "5:00 PM - 9:00 PM",
      "Address / Location": "The Float @ Marina Bay",
      "Postal Code": "039123",
      Category: "National Event",
      "Price / Ticket Info": "Free (ticketed)",
      Description: "Experience fireworks and performances leading up to National Day.",
      "Image URL(s)": [
        "https://i.imgur.com/kLpTAeB.jpg", // replace with real or static image
      ],
      Organizer: "Singapore Armed Forces",
      "Official Event Link": "https://ndp.gov.sg",
      url: [],
    },
  ];

  return (
    <>
      <Navigationbar />
      <SearchForm></SearchForm>
      <section id="event-cards" className="bg-gray-50 min-h-screen py-12 pt-16 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                className="max-w-xs w-full"
              />
            ))}
          </div>
        </div>
      </section>


      <footer className="text-left text-gray-400 py-4">
        © 2025 KiasuPlanner. All rights reserved.
      </footer>
    </>
  )
}