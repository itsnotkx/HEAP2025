
import EventTabs from '@/components/eventTabs';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';


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

interface Params {
  params: {
    id: string;
  };
}

const EVENTS_DIR = path.join(process.cwd(), '../backend/utils/webscraper/event_listings');

export async function generateStaticParams() {
  const files = fs.readdirSync(EVENTS_DIR);
  return files
    .filter((file) => file.endsWith('.json'))
    .map((file) => ({
      id: file.replace('.json', ''),
    }));
}

function getEventById(id: string) {
  const filePath = path.join(EVENTS_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export default function EventPage({ params }: Params) {
  const event = getEventById(params.id);

  if (!event) notFound();

  return (
      <EventTabs event={event} />
  )}