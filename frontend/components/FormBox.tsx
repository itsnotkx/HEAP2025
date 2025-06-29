"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, DatePicker, TimeInput } from "@heroui/react";
import {
  getLocalTimeZone,
  today,
  Time,
} from "@internationalized/date";

export default function FormBox() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: today(getLocalTimeZone()),
    startTime: new Time(8, 0),
    endTime: new Time(17, 30),
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlanMyDay = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      date: formData.date.toString().replace(":", "-"),
      startTime: formData.startTime.toString().replace(":", "-"),
      endTime: formData.endTime.toString().replace(":", "-"),
    });
    router.push(`/planner?${params.toString()}`);
  };

  const handleSurpriseMe = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/surprise");
  };

  return (
    <div className="mx-auto p-6 rounded-2xl shadow-md mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center mt-10">
        When are you free?
      </h2>
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
        <div className="flex flex-row gap-8 justify-center mt-4">
  <Button
    type="submit"
    className="flex-1 px-6 py-3 bg-primary text-white font-roboto rounded-lg text-base shadow"
  >
    Plan My Day
  </Button>
  <Button
    type="button"
    onClick={handleSurpriseMe}
    className="flex-1 px-6 py-3 bg-accent text-white font-roboto rounded-lg text-base shadow"
  >
    Surprise Me
  </Button>
</div>

      </form>
    </div>
  );
}
