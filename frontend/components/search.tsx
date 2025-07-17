"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, DatePicker, TimeInput } from "@heroui/react";
import { getLocalTimeZone, today, Time } from "@internationalized/date";

export default function FormBox() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: today(getLocalTimeZone()), // DateValue object
    startTime: new Time(8, 0), // Time object
    endTime: new Time(17, 30), // Time object
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams({
      date: formData.date.toString().replace(":", "-"),
      startTime: formData.startTime.toString().replace(":", "-"),
      endTime: formData.endTime.toString().replace(":", "-"),
    });

    router.push(`/planner?${params.toString()}`);
  };

  return (
    <div className="mx-auto p-6 rounded-2xl shadow-md mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">
        When are you free?
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="w-full flex flex-col gap-1">
          <DatePicker
            label="Date"
            minValue={today(getLocalTimeZone())}
            value={formData.date}
            onChange={(val) => handleChange("date", val)}
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

        <Button className="w-full mt-2 bg-primary" type="submit">
          Plan My
        </Button>
      </form>
    </div>
  );
}
