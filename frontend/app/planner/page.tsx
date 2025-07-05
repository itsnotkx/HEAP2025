import Navigationbar from "@/components/navbar";
import PopupBar from "@/components/PopupBar";
import EventCard from "@/components/eventCard";
import { getEvents } from "@/utils/server/getEvents";

export default async function TimelinePage() {
  const events = await getEvents();

  // Adjust if your navbar height is different
  const NAVBAR_HEIGHT = "4rem"; // 64px

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content starts below navbar + popup bar */}
      <main
        className="max-w-6xl mx-auto px-4"
        style={{
          paddingTop: `${NAVBAR_HEIGHT}`,
        }}
      >
        <div className="grid grid-cols-3 gap-6 items-stretch">
          {events.map((event) => (
            <EventCard key={event.id} event={event} className="h-full w-full" />
          ))}
        </div>
      </main>
    </div>
  );
}
