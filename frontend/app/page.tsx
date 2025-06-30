import { Button } from "@heroui/button";

import Navigationbar from "../components/navbar";
import { getEvents } from '@/utils/server/getEvents';
import { CheckCircle, Calendar, MapPin } from "lucide-react";

import SearchForm from "@/components/FormBox";

import ScrollButton from "@/components/ScrollButton";

// import { useRouter } from 'next/navigation';

export default async function App() {
    //    const router = useRouter();
    // const handleLoginClick = () => {
    //     router.push('/login')
    // }
    //   const events = await getEvents();
    const scrollToEvents = () => {
        const section = document.getElementById("searchForm");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };
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
            <header>
                <Navigationbar />
            </header>

            <main className="min-h-screen">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-12 py-16 mt-20">
                    {/* Left Text */}
                    <div>
                        <h1 className="text-4xl font-bold mb-4">
                            Kiasu? Fret not, we take care of all the planning for you!
                        </h1>
                        <p className="text-gray-500 mb-6">
                            Spend less time planning schedules and have more time enjoying yourself!
                        </p>
                        <ScrollButton targetId="searchForm" className="bg-accent text-white px-6 py-2 rounded-full" >
                            Get Started
                        </ScrollButton>
                    </div>

                    {/* Right Schedule */}
                    <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Mandai Madness</h2>
                        <p className="text-sm text-gray-400 mb-4">June 19th</p>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-4">
                                <p className="w-16 text-gray-500">10 AM</p>
                                <div className="bg-primary text-white px-4 py-2 rounded-md w-full text-center font-medium">
                                    Singapore Zoo
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <p className="w-16 text-gray-500">12 PM</p>
                                <div className="bg-accent text-white px-4 py-2 rounded-md w-full text-center font-medium">
                                    Lunch
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <p className="w-16 text-gray-500">2 PM</p>
                                <div className="bg-primary text-white px-4 py-2 rounded-md w-full text-center font-medium">
                                    River Safari
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-12 pb-16">
                    <div className="flex flex-col items-center">
                        <CheckCircle className="text-red-400 w-10 h-10 mb-2" />
                        <p className="font-bold">Integrated<br />Event Ticket Purchases</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Calendar className="text-cyan-400 w-10 h-10 mb-2" />
                        <p className="font-bold">Event<br />Scheduling and Optimization</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <MapPin className="text-red-400 w-10 h-10 mb-2" />
                        <p className="font-bold">Directions and<br />ETAs provided</p>
                    </div>
                </section>
            </main>
            <div id="searchForm">
                <SearchForm />
            </div>

            <footer className="text-left text-gray-400 py-4 mt-20">
                © 2025 KiasuPlanner. All rights reserved.
            </footer>

        </>
    );
}
