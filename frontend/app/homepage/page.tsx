import Navigationbar from "../../components/navbar";
import EventCard from '@/components/eventCard';
import { getEvents } from '../../utils/utils/server/getEvents';

export default async function App() {
  const events = await getEvents();
  return (
    <>
      <header>
        <Navigationbar />
      </header>
      <main className="bg-gray-50 min-h-screen py-12 pt-16 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                className="max-w-xs w-full"
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
