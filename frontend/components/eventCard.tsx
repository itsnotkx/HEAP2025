// components/EventCard.tsx
import Image from "next/image";

type Event = {
  id: string;
  title: string;
  location: string;
  rating: number;
  tags: string[];
  imageUrl: string;
};

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="rounded-xl border shadow-sm overflow-hidden w-full max-w-xs bg-white">
      <Image
        src={event.imageUrl}
        alt={event.title}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-sm">{event.title}</h3>
        <p className="text-gray-500 text-sm">{event.location}</p>
        <div className="flex items-center space-x-1 my-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < event.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {event.tags.map(tag => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
