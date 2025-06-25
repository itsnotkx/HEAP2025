"use client";

import React, { useState } from "react";
import { Input, Button, DatePicker, TimeInput} from "@heroui/react";
import {getLocalTimeZone, parseDate, today, Time} from "@internationalized/date";



export default function FormBox() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Submit to backend or validate here
  };

  return (
    <div className="mx-auto p-6 rounded-2xl shadow-md mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">When are you free?</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="w-full flex flex-col gap-1 hover:">
            <DatePicker
                defaultValue={today(getLocalTimeZone())}
                label="Date"
                minValue={today(getLocalTimeZone())}
            />
        </div>

    <div className="w-full flex flex-row gap-2">
      <TimeInput defaultValue={new Time(8, 0)} label= "Start Time"/>

      <TimeInput defaultValue={new Time(5, 30)} label="End Time" />
    </div>



        <Button type="submit" className="w-full mt-2 bg-primary">
          Submit
        </Button>
      </form>
    </div>
  );
}
