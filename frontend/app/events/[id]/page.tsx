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

const EVENTS_DIR = path.join(process.cwd(), 'event_listings');

export async function generateStaticParams(): Promise<Params['params'][]> {
  const files = fs.readdirSync(EVENTS_DIR);
  return files
    .filter((file) => file.endsWith('.json'))
    .map((file) => ({
      id: file.replace('.json', ''),
    }));
}

function getEventById(id: string): Event | null {
  const filePath = path.join(EVENTS_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent) as Event;
}

export default function EventPage({ params }: Params) {
  const event = getEventById(params.id);

  if (!event) notFound();

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="max-w-xl w-full shadow-lg">
        <CardHeader className="flex flex-col items-center">
          {event["Image URL(s)"] && event["Image URL(s)"].length > 0 && (
            <img
              src={event["Image URL(s)"][0]}
              alt={event.Title}
              className="rounded-lg mb-4 w-full object-cover max-h-64"
            />
          )}
          <Heading level={2}>{event.Title}</Heading>
          <Text className="text-gray-500">{event["Address / Location"]}</Text>
          <Text className="text-gray-400">{event.Time}</Text>
        </CardHeader>
        <CardBody>
          <Tabs>
            <TabList>
              <Tab>Description</Tab>
              <Tab>Price/Ticket Info</Tab>
              <Tab>Official Event Link</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Text>
                  {event.Description || "No description available."}
                </Text>
              </TabPanel>
              <TabPanel>
                <Text>
                  {event["Price / Ticket Info"] || "No price or ticket info available."}
                </Text>
              </TabPanel>
              <TabPanel>
                {event["Official Event Link"] ? (
                  <Button
                    as="a"
                    href={event["Official Event Link"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                  >
                    Go to Official Event Page
                  </Button>
                ) : (
                  <Text>No official event link available.</Text>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </main>
  );
}
Key Points