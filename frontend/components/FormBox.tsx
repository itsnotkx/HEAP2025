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
import { useSession } from "next-auth/react";

export default function FormBox({ onSubmit, onSurprise }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: today(getLocalTimeZone()),
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { keyword, date, startTime, endTime } = formData;
    const hasKeyword = keyword.trim() !== "";
    const hasDateTime = date && startTime && endTime;

    if (!hasKeyword && !hasDateTime) {
      setErrorMessage("Please enter a keyword or select a date and time range.");
      return;
    }

    if (hasDateTime && formData.startTime > formData.endTime) {
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
      searchParams.set("user_id", session.user.id)
    }

    const start_date = hasDateTime ? `${date.toString()}T${startTime}` : undefined;
    const end_date = hasDateTime ? `${date.toString()}T${endTime}` : undefined;

    try {
      const data = await search(keyword.trim(), start_date, end_date, session.user.id);
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

        console.error("Error response:", {
          status,
          data,
          headers: err.response.headers
        });

        switch (status) {
          case 422:
            errorMsg = `Validation error: ${data.detail || 'Invalid parameters provided'}`;
            break;
          case 404:
            errorMsg = data.detail || "No events found for the given criteria";
            break;
          case 401:
            errorMsg = "Authentication required. Please log in again.";
            break;
          case 403:
            errorMsg = "Access denied. You don't have permission to perform this action.";
            break;
          case 500:
            errorMsg = "Server error. Please try again later.";
            break;
          default:
            errorMsg = `Error ${status}: ${data.detail || data.message || 'Unknown error occurred'}`;
        }
      } else if (err.request) {
        console.error("No response received:", err.request);
        errorMsg = "Network error. Please check your connection and try again.";
      } else {
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

        {/* Only show Surprise Me if onSurprise is provided */}
        {onSurprise && (
          <Button
            type="button"
            className="w-full bg-indigo-500 text-white py-3 rounded-xl shadow mt-2"
            onClick={handleSurpriseClick}
            disabled={isLoading}
          >
            Surprise Me!
          </Button>
        )}
      </form>

      {/* Results Section */}
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
