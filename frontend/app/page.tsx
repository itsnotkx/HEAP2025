"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Calendar, MapPin } from "lucide-react";
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";

// ----- Types -----
type TravelMode = "transit" | "walking" | "bicycling" | "driving";

interface EventItem {
  name: string;
  address: string;
}

// ----- Demo function -----
function getDemoDuration(from: string, to: string, mode: TravelMode): number {
  const base =
    from === "Singapore Zoo" && to === "Lunch"
      ? 14
      : from === "Lunch" && to === "River Safari"
      ? 8
      : 11;
  const multiplier =
    mode === "transit"
      ? 1
      : mode === "walking"
      ? 3
      : mode === "bicycling"
      ? 1.5
      : mode === "driving"
      ? 0.9
      : 1;
  return Math.round(base * multiplier);
}

// ----- Modes and Colors -----
const modeOptions: { value: TravelMode; label: string; icon: string }[] = [
  { value: "transit", label: "Transit", icon: "🚌" },
  { value: "walking", label: "Walking", icon: "🚶🏻" },
  { value: "bicycling", label: "Cycling", icon: "🚴🏻" },
  { value: "driving", label: "Driving", icon: "🚗" },
];

const travelColors: Record<TravelMode, string> = {
  transit: "bg-cyan-100 text-cyan-800 border-cyan-200",
  driving: "bg-orange-100 text-orange-800 border-orange-200",
  walking: "bg-green-100 text-green-800 border-green-200",
  bicycling: "bg-violet-100 text-violet-800 border-violet-200",
};

// ===== Main Component =====

export default function App() {
  const router = useRouter();

  const [formData, setFormData] = useState<{ date: ReturnType<typeof today> }>({
    date: today(getLocalTimeZone()),
  });

  const [events, setEvents] = useState<EventItem[]>([
    { name: "Singapore Zoo", address: "80 Mandai Lake Rd, Singapore" },
    { name: "Lunch", address: "HaiDiLao Jurong East" },
    { name: "River Safari", address: "River Wonders, Mandai" },
  ]);
  const [modes, setModes] = useState<TravelMode[]>(["transit", "transit"]);

  // ----- Calculate segment durations -----
  const travelDurations = useMemo(
    () =>
      events
        .slice(0, -1)
        .map((from, idx) =>
          getDemoDuration(from.name, events[idx + 1]?.name, modes[idx]),
        ),
    [events, modes]
  );

  // ----- Move event -----
  function moveEvent(index: number, direction: "up" | "down") {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === events.length - 1)
    ) {
      return;
    }
    const newEvents = [...events];
    if (direction === "up") {
      [newEvents[index - 1], newEvents[index]] = [
        newEvents[index],
        newEvents[index - 1],
      ];
    } else {
      [newEvents[index], newEvents[index + 1]] = [
        newEvents[index + 1],
        newEvents[index],
      ];
    }
    let newModes = [...modes];
    if (direction === "up" && index > 0) {
      if (index === events.length - 1) {
        newModes = [
          ...newModes.slice(0, index - 1),
          newModes[index],
          newModes[index - 1],
        ];
      } else {
        [newModes[index - 1], newModes[index]] = [
          newModes[index],
          newModes[index - 1],
        ];
      }
    } else if (direction === "down" && index < events.length - 1) {
      [newModes[index], newModes[index + 1]] = [
        newModes[index + 1],
        newModes[index],
      ];
    }
    setEvents(newEvents);
    setModes(newModes.slice(0, newEvents.length - 1));
  }

  // ----- Change mode -----
  function changeMode(segmentIdx: number, newMode: TravelMode) {
    const newModes = [...modes];
    newModes[segmentIdx] = newMode;
    setModes(newModes);
  }

  // ----- Form handlers -----
  function handleChange(field: string, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }
  function handleSubmit() {
    router.push(`/planner?date=${formData.date.toString()}`);
  }
  function handleSurpriseMe() {
    router.push(`/planner?date=${formData.date.toString()}&surprise=true`);
  }

  // ===== Render =====
  return (
    <main className="min-h-screen bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start px-12 py-16 mt-10">
        {/* Left: Main CTA */}
        <div>
          <h1 className="text-4xl font-bold mb-4">
            Kiasu? Fret not, we take care of all the planning for you!
          </h1>
          <p className="text-gray-500 mb-6">
            Spend less time planning schedules and have more time enjoying
            yourself!
          </p>
          <div className="flex items-end space-x-4 mb-4">
            <I18nProvider locale="en-SG">
              <DatePicker
                label="Select a Date"
                minValue={today(getLocalTimeZone())}
                value={formData.date}
                onChange={(val) => handleChange("date", val)}
              />
            </I18nProvider>
            <Button
              className="bg-accent text-white px-6 py-2 rounded-full"
              onPress={handleSubmit}
            >
              Get Started
            </Button>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Need some ideas? Let us surprise you!
          </p>
          <Button
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full"
            onPress={handleSurpriseMe}
          >
            🎲 Surprise Me!
          </Button>
        </div>

        {/* Right: Event Planner Demo */}
        <div className="w-full max-w-md">
          <h1 className="text-lg font-bold mb-1 text-teal-500">An Example!</h1>
          <h2 className="text-lg font-bold mb-1 text-red-500">
            Mandai Madness
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            Add events to this planner and create your ideal schedule. <br />
            Click <span className="text-red-500 font-semibold">Get Started</span> to
            build your own!
          </p>

          <div className="flex flex-col gap-4 py-2">
            {events.map((event, idx) => (
              <React.Fragment key={event.name}>
                {/* Event */}
                <div className="flex items-start">
                  <span className="w-2 h-2 rounded-full bg-teal-400 mr-3 mt-3" />
                  <div className="bg-white rounded-xl shadow px-4 py-3 flex-1 flex items-center min-h-[64px]">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <span className="font-semibold text-base">
                          {event.name}
                        </span>
                        <button
                          disabled
                          aria-label="Remove"
                          className="ml-2 p-1 rounded-full hover:bg-gray-200 text-gray-400 transition"
                          tabIndex={-1}
                        >
                          {/* SVG (x) icon */}
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              clipRule="evenodd"
                              d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
                              fillRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="text-sm text-gray-400 truncate">
                        {event.address}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center ml-2 gap-1">
                      <button
                        aria-label="Move Up"
                        className="bg-teal-400 hover:bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center mb-1 shadow transition"
                        disabled={idx === 0}
                        onClick={() => moveEvent(idx, "up")}
                      >
                        {/* Up arrow */}
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            clipRule="evenodd"
                            d="M10 7l5 6H5l5-6z"
                            fillRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        aria-label="Move Down"
                        className="bg-rose-400 hover:bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow transition"
                        disabled={idx === events.length - 1}
                        onClick={() => moveEvent(idx, "down")}
                      >
                        {/* Down arrow */}
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            clipRule="evenodd"
                            d="M10 13l5-6H5l5 6z"
                            fillRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                {/* Transition pill/dropdown */}
                {idx < events.length - 1 && (
                  <div className="flex justify-center items-center mb-1">
                    <select
                      className={`rounded-full font-semibold px-3 py-1 text-xs border ${travelColors[modes[idx]]} focus:outline-none shadow`}
                      style={{ minWidth: 95 }}
                      value={modes[idx]}
                      onChange={(e) =>
                        changeMode(idx, e.target.value as TravelMode)
                      }
                    >
                      {modeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.icon + " " + opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="ml-3 text-gray-500 text-xs">
                      ~{travelDurations[idx]} min
                    </span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-12 pb-16">
        <div className="flex flex-col items-center">
          <CheckCircle className="text-red-400 w-10 h-10 mb-2" />
          <p className="font-bold">
            Integrated
            <br />
            Event Ticket Purchases
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Calendar className="text-red-400 w-10 h-10 mb-2" />
          <p className="font-bold">
            Event
            <br />
            Scheduling and Optimization
          </p>
        </div>
        <div className="flex flex-col items-center">
          <MapPin className="text-red-400 w-10 h-10 mb-2" />
          <p className="font-bold">
            Directions and
            <br />
            ETAs provided
          </p>
        </div>
      </section>
      <footer className="text-left text-gray-400 py-4">
        © 2025 KiasuPlanner. All rights reserved.
      </footer>
    </main>
  );
}
