"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Calendar, MapPin } from "lucide-react";
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import React, { useState } from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import {I18nProvider} from "@react-aria/i18n";

export default function App() {
  const router = useRouter();

  // Initialize date with today as default
  const [formData, setFormData] = useState({
    date: today(getLocalTimeZone()),
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Optional: Format the date as string (e.g., YYYY-MM-DD)
    const selectedDate = formData.date.toString(); // or format as needed

    // Redirect to planner page with date query param
    router.push(`/planner?date=${selectedDate}`);
  };

  return (
    <main className="min-h-screen">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-12 py-16 mt-10">
        {/* Left Text */}
        <div>
          <h1 className="text-4xl font-bold mb-4">
            Kiasu? Fret not, we take care of all the planning for you!
          </h1>
          <p className="text-gray-500 mb-6">
            Spend less time planning schedules and have more time enjoying yourself!
          </p>

          {/* Date + Button Row */}
          <div className="flex items-end space-x-4">
            <I18nProvider locale="en-SG">
            <DatePicker
              label="Select a Date"
              value={formData.date}
              onChange={(val) => handleChange("date", val)}
              minValue={today(getLocalTimeZone())}
            />
            </I18nProvider>
            <Button
              className="bg-accent text-white px-6 py-2 rounded-full"
              onPress={handleSubmit}
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Right Schedule (static sample) */}
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

      {/* Bottom Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-12 pb-16">
        <div className="flex flex-col items-center">
          <CheckCircle className="text-red-400 w-10 h-10 mb-2" />
          <p className="font-bold">Integrated<br />Event Ticket Purchases</p>
        </div>
        <div className="flex flex-col items-center">
          <Calendar className="primary-text w-10 h-10 mb-2" />
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
    </main>
  );
}
