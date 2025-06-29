"use client"

import { Button } from "@heroui/button";
import { CheckCircle, Calendar, MapPin } from "lucide-react";
import KiasuPlannerLogo from "@/components/logo";
import { schibstedGrotesk } from "@/config/fonts";

import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();
    const handleLoginClick = () => {
        router.push('/login')
    }
    return (
        <div className={`${schibstedGrotesk.variable} font-sans flex flex-col min-h-screen`}>
            {/* Navbar */}
            <header className="flex justify-between items-center px-8 py-6 border-b">
                <KiasuPlannerLogo />
                <nav className="flex space-x-40 text-lg font-semibold">
                    <a href="#" className="hover:text-primary">Features</a>
                    <a href="#" className="hover:text-primary">About Us</a>
                    <a href="#" className="hover:text-primary">Support</a>
                </nav>
                <Button color="primary" className="text-white px-10 py-2 rounded-full" size="lg" onPress = {handleLoginClick}>
                    Login
                </Button>
            </header>

            {/* Main Section */}
            <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-12 py-16">
                {/* Left Text */}
                <div>
                    <h1 className="text-4xl font-bold mb-4">
                        Kiasu? Fret not, we take care of all the planning for you!
                    </h1>
                    <p className="text-gray-500 mb-6">
                        Spend less time buying tickets and planning schedules and have more time enjoying yourself!
                    </p>
                    <Button color="secondary" className="text-white px-6 py-2 rounded-full" onPress = {handleLoginClick}>
                        Get Started
                    </Button>
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
                            <div className="bg-secondary text-white px-4 py-2 rounded-md w-full text-center font-medium">
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
            </main>


            {/* Features Section */}
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

            <footer className="text-left text-gray-400 py-4">
                © 2025 KiasuPlanner. All rights reserved.
            </footer>
        </div>
)}
