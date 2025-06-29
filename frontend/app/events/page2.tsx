import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardBody,
  Tabs,
  Tab,
  Button,
} from '@heroui/react';

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

