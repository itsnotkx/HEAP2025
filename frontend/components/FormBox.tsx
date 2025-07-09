"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, DatePicker, Form, Input, TimeInput } from "@heroui/react";
import {
  getLocalTimeZone,
  today,
  Time,
} from "@internationalized/date";
import { ButtonGroup } from "@heroui/button";

export default function FormBox({onSubmit}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: today(getLocalTimeZone()),
    startTime: new Time(8, 0),
    endTime: new Time(17, 30),
  });



  const [mode, setMode] = useState("availability");

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleActivitySearch = (e: React.FormEvent) => {
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



  const handleSurpriseMe = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/surprise");
  };

  return (
    <div className="mx-auto p-6 rounded-2xl shadow-lg bg-white mt-10 top-0 left-0">
      {/* Toggle Buttons */}
      <div className="mb-6">
        <ButtonGroup className="flex gap-2">
          <Button
            onClick={() => setMode("activity")}
            className={`w-full py-2 rounded-lg text-base font-medium transition-all ${mode === "activity"
              ? "bg-secondary shadow-inner"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            I want to participate in...
          </Button>
          <Button
            onClick={() => setMode("availability")}
            className={`w-full py-2 rounded-lg text-base font-medium transition-all ${mode === "availability"
              ? "bg-secondary shadow-inner"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            When are you free?
          </Button>
        </ButtonGroup>
      </div>

      {/* Form Based on Mode */}
      {mode === "availability" && (
        <form className="space-y-4" onSubmit={handlePlanMyDay}>
          <div className="w-full flex flex-col gap-1">
            <DatePicker
              label="Date"
              value={formData.date}
              onChange={(val) => handleChange("date", val)}
              minValue={today(getLocalTimeZone())}
            />
          </div>
          <div className="w-full flex flex-row gap-2">
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

      {mode === "activity" && (
        <Form className="space-y-4" onSubmit={handleActivitySearch}>
          <Input
            isRequired
            errorMessage="Please enter a query"
            placeholder="Arts and Crafts, Card Tournaments, Family events"
          />
          <Button
            type="submit"
            className="w-full px-6 py-3 bg-primary text-white rounded-xl shadow transition"
          >
            Find Activities
          </Button>
        </Form>
      )}
    </div>
  );
}