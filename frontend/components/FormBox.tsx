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

      setResults(data);
      if (onSearchResults) {
        onSearchResults(data);
      }

      if (data.length === 0) {
        setErrorMessage("No events found for your search criteria.");
      }
    } catch (err: unknown) {
      console.error("Search error:", err);
      setErrorMessage("Something went wrong while searching.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSurpriseClick = (e: any) => {
    e.preventDefault();
    if (onSurprise) {
      onSurprise(formData);
    }
  };

  // ✅ JSX is returned from the top-level of the component
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
    </div>
  );
}
