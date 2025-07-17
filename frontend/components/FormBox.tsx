"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, DatePicker, Input, TimeInput } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import {
  getLocalTimeZone,
  parseDate,
  today,
  DateValue,
} from "@internationalized/date";
import { useSession } from "next-auth/react";

import { search } from "@/app/api/apis";

export default function FormBox({
  onSurprise,
  onSearchResults,
  date,
}: {
  onSurprise?: (formData: any) => void;
  onSearchResults?: (results: any[]) => void;
  date?: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const parsedDate: DateValue = date
    ? parseDate(date)
    : today(getLocalTimeZone());

  const [formData, setFormData] = useState({
    date: parsedDate,
    startTime: null,
    endTime: null,
    keyword: "",
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
      setErrorMessage(
        "Please enter a keyword or select a date and time range.",
      );

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

    const searchParams = new URLSearchParams();

    if (hasKeyword) {
      searchParams.set("keyword", keyword.trim());
    }

    if (hasDateTime) {
      const start = `${date.toString()}T${startTime}`;
      const end = `${date.toString()}T${endTime}`;

      searchParams.set("start_date", start);
      searchParams.set("end_date", end);
      searchParams.set("user_id", session.user.id);
    }

    // Update the browser URL and trigger navigation (optional: can use shallow routing)
    const start_date = hasDateTime
      ? `${date.toString()}T${startTime}`
      : undefined;
    const end_date = hasDateTime ? `${date.toString()}T${endTime}` : undefined;

    try {
      const data = await search(
        keyword.trim(),
        start_date,
        end_date,
        session.user.id,
      );

      setResults(data); // show results
      if (onSearchResults) {
        onSearchResults(data); // pass to parent
      }

      // If no results found, show a message
      if (data.length === 0) {
        setErrorMessage("No events found for your search criteria.");
      }
    } catch (err) {
      console.error("Search error:", err);

      // Enhanced error handling with detailed messages
      let errorMsg = "Something went wrong while searching.";

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        console.error("Error response:", {
          status,
          data,
          headers: err.response.headers,
        });

        switch (status) {
          case 422:
            errorMsg = `Validation error: ${data.detail || "Invalid parameters"}`;
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
            errorMsg = `Error ${status}: ${data.detail || "Unknown error"}`;
        }
      } else if (err.request) {
        // Request was made but no response received
        console.error("No response received:", err.request);
        errorMsg = "Network error. Please check your connection and try again.";
      } else {
        // Something else happened
        console.error("Request setup error:", err.message);
        errorMsg = `Request error: ${err.message}`;
      }

      setErrorMessage(errorMsg);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // handleSurpriseClick - only calls onSurprise if provided
  const handleSurpriseClick = (e) => {
    e.preventDefault();
    if (onSurprise) {
      onSurprise(formData);
    }
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
              minValue={today(getLocalTimeZone())}
              value={formData.date}
              onChange={(val) => handleChange("date", val)}
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
          className="w-full bg-primary text-white py-3 rounded-xl shadow"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>

        {onSurprise && (
          <Button
            className="w-full bg-indigo-500 text-white py-3 rounded-xl shadow mt-2"
            disabled={isLoading}
            type="button"
            onClick={handleSurpriseClick}
          >
            Surprise Me!
          </Button>
        )}
      </form>

      {/* {results.length > 0 && (
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
      )} */}
    </div>
  );
}
