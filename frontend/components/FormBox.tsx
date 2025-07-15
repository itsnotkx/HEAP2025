"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, DatePicker, Form, Input, TimeInput } from "@heroui/react";
import {I18nProvider} from "@react-aria/i18n";

import {
  getLocalTimeZone,
  parseDate,
  today,
  Time,
  DateValue,
} from "@internationalized/date";
import { search } from "@/app/api/apis";
import { useSession } from "next-auth/react";

// ✅ Props typing
interface FormBoxProps {
  date?: string; // date passed in from URL param
}

export default function FormBox({ date}: FormBoxProps) {
  const { data: session } = useSession();
  const router = useRouter();

  // ✅ Parse the incoming date string to DateValue
  const parsedDate: DateValue = date ? parseDate(date) : today(getLocalTimeZone());

  const [formData, setFormData] = useState({
    date: parsedDate,
    startTime: null,
    endTime: null, 
    keyword: ""
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { keyword, date, startTime, endTime } = formData;
    const hasKeyword = keyword.trim() !== "";
    const hasDateTime = date && startTime && endTime;

    if (!hasKeyword && !hasDateTime) {
      setErrorMessage("Please enter a keyword or select a date and time range.");
      return;
    }

    if (hasDateTime && startTime > endTime) {
      setErrorMessage("End time must be after start time.");
      return;
    }

    if (!session?.user?.id) {
      setErrorMessage("Please log in to search for events.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    const start = hasDateTime ? `${date.toString()}T${startTime}` : undefined;
    const end = hasDateTime ? `${date.toString()}T${endTime}` : undefined;

    try {
      const data = await search(keyword.trim(), start, end, session.user.id);
      setResults(data);

      if (data.length === 0) {
        setErrorMessage("No events found for your search criteria.");
      }
    } catch (err) {
      console.error("Search error:", err);
      let errorMsg = "Something went wrong while searching.";

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        switch (status) {
          case 422:
            errorMsg = `Validation error: ${data.detail || 'Invalid parameters'}`;
            break;
          case 404:
            errorMsg = data.detail || "No events found.";
            break;
          case 401:
            errorMsg = "Authentication required.";
            break;
          case 403:
            errorMsg = "Access denied.";
            break;
          case 500:
            errorMsg = "Server error.";
            break;
          default:
            errorMsg = `Error ${status}: ${data.detail || 'Unknown error'}`;
        }
      } else if (err.request) {
        errorMsg = "Network error. Please try again.";
      } else {
        errorMsg = `Request error: ${err.message}`;
      }

      setErrorMessage(errorMsg);
      setResults([]);
    } finally {
      setIsLoading(false);
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
          <I18nProvider locale="en-SG">
          <DatePicker
            label="Date"
            value={formData.date}
            onChange={(val) => handleChange("date", val)}
            minValue={today(getLocalTimeZone())}
          />
          </I18nProvider>

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
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-xl shadow"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>

      {results.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">Results ({results.length})</h2>
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
}
