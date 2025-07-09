"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, DatePicker, Form, Input, TimeInput } from "@heroui/react";
import {
  getLocalTimeZone,
  today,
  Time,
} from "@internationalized/date";
import { search } from "@/app/api/apis";

export default function FormBox({ onSubmit }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: today(getLocalTimeZone()),
    startTime: null,
    endTime: null,
    keyword: ""
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [results, setResults] = useState([]);
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams({
    });
    router.push(`/planner?${params.toString()}`);
  };
/*
  const handlePlanMyDay = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      date: formData.date.toString().replace(":", "-"),
      startTime: formData.startTime.toString().replace(":", "-"),
      endTime: formData.endTime.toString().replace(":", "-"),
    });
    router.push(`/planner?${params.toString()}`);
  };
*/
  // In FormBox, before calling onSubmit:
const pad = (n) => n.toString().padStart(2, "0");

const handlePlanMyDay = (e: React.FormEvent) => {
  e.preventDefault();

  // Convert CalendarDate to 'YYYY-MM-DD'
  const dateStr = formData.date.toString();

  // Convert Time to 'HH:MM'
  const startTimeStr = `${pad(formData.startTime.hour)}:${pad(formData.startTime.minute)}`;
  const endTimeStr = `${pad(formData.endTime.hour)}:${pad(formData.endTime.minute)}`;

  onSubmit({
    date: dateStr,
    startTime: startTimeStr,
    endTime: endTimeStr,
  });
};

/*
  const handlePlanMyDay = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass the form data up to the parent
    onSubmit({
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
    });
  };*/


    if (hasKeyword) {
      searchParams.set("keyword", keyword.trim());
    }

    if (hasDateTime) {
      const start = `${date.toString()}T${startTime}`;
      const end = `${date.toString()}T${endTime}`;
      searchParams.set("start_date", start);
      searchParams.set("end_date", end);
    }

    // Update the browser URL and trigger navigation (optional: can use shallow routing)
    const start_date = hasDateTime ? `${date.toString()}T${startTime}` : undefined;
    const end_date = hasDateTime ? `${date.toString()}T${endTime}` : undefined;

    try {
      const data = await search(keyword.trim(), start_date, end_date);
      setResults(data); // show results
    } catch (err) {
      console.log(err);
      setErrorMessage("Something went wrong while searching.");
    }
  };

  const handleSurpriseMe = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/surprise");
  };

  return (
    <div className="mx-auto p-6 rounded-2xl shadow-lg bg-white mt-10">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Search by keyword"
          placeholder="e.g. Sports, Politics, Volunteer..."
          value={formData.keyword}
          onChange={(e) => handleChange("keyword", e.target.value)}
        />

        <div className="flex flex-col gap-2">
          <DatePicker
            label="Date"
            value={formData.date}
            onChange={(val) => handleChange("date", val)}
            minValue={today(getLocalTimeZone())}
          />

          <div className="flex gap-2">
            <TimeInput
              label="Start Time"
              value={formData.startTime}
              onChange={(val) => handleChange("startTime", val)}
            />
            <TimeInput
              label="End Time"
              value={formData.endTime}
              onChange={(val) => handleChange("endTime", val)}
            />
          </div>

          
          <div className="flex flex-row gap-4 justify-center mt-4">
          
            <Button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-white rounded-xl shado transition"
            >
              Plan My Day
            </Button>
            <Button
              type="button"
              onClick={handleSurpriseMe}
              className="flex-1 px-6 py-3 bg-accent text-white rounded-xl shadow transition"
            >
              Surprise Me
            </Button>
          </div>
        </form>
      )}


        {errorMessage && (
          <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-xl shadow"
        >
          Search
        </Button>
      </form>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">Results</h2>
          {results.map((event) => (
            <div
              key={event.id}
              className="p-4 bg-gray-50 border rounded-lg shadow-sm"
            >
              <h3 className="text-base font-bold">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.description}</p>
              <p className="text-sm text-gray-500">
                {event.start_time} → {event.end_time}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
