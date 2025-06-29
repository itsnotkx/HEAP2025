import Navigationbar from "@/components/navbar";
import PopupBar from "@/components/PopupBar";
import EventCard from "@/components/eventCard";
import { getEvents } from "@/utils/utils/server/getEvents";

export default async function TimelinePage() {
  const events = await getEvents();

  // Adjust if your navbar height is different
  const NAVBAR_HEIGHT = "4rem"; // 64px
  const POPUPBAR_HEIGHT = "25vh";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Always visible navbar for this page */}
      <Navigationbar shouldHideOnScroll={false} />

      {/* Popup bar for this page only */}
      <PopupBar />

      {/* Main content starts below navbar + popup bar */}
      <main
        className="max-w-6xl mx-auto px-4 mt-7"
        style={{
          paddingTop: `calc(${NAVBAR_HEIGHT} + ${POPUPBAR_HEIGHT})`,
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
          {events.map((event) => (
            <EventCard key={event.id} event={event} className="h-full w-full" />
          ))}
        </div>
      </main>
    </div>
  );
}
