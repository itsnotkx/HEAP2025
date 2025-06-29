
"use client";
import {
  Card,
  CardHeader,
  CardBody,
  Tabs,
  Tab,
  Button,
} from '@heroui/react';
import EventMap from '../components/getMap'

interface Event {
  Title: string;
  "Start Date": string | null;
  "End Date": string | null;
  Time: string | null;
  "Address / Location": string | null;
  "Postal Code": string | null;
  Category: string | null;
  "Price / Ticket Info": string | null;
  Description: string | null;
  "Image URL(s)": string[];
  Organizer: string | null;
  "Official Event Link": string | null;
  url: string[];
}

export default function EventTabs({ event }: { event: Event }) {
  return (
    <>
      <h1>{event.Title}</h1>
      {/* Render images */}
      {event["Image URL(s)"] && event["Image URL(s)"].length > 0 && (
        <div className="flex gap-2 mb-4">
          {event["Image URL(s)"].map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={event.Title}
              className="max-h-48 rounded"
            />
          ))}
        </div>
      )}
        <Tabs aria-label = "options">
          <Tab key="Description" title="Description">
            <Card>
              <CardBody>
                {event.Description || "No description available"}
              </CardBody>
            </Card>
          </Tab>
          <Tab key="Location" title="Location">
            <Card>
              <CardBody>
                <EventMap location={event["Address / Location"] ?? event["Postal Code"] ?? ""} />
              </CardBody>
            </Card>
          </Tab>

        </Tabs>



</>
)}