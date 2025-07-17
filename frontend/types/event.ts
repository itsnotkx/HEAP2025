// types/Event.ts
export interface RawEvent {
  event_id: number;
  title: string;
  start_date: string;
  end_date: string;
  address: string ;
  price: string ;
  categories: number[] ;
  description: string ;
  organiser_id: number;
  images: string[];
}
/*
    db_event = Event(
        title=event_data.title,
        start_date=event_data.start_date,
        end_date=event_data.end_date,
        address=event_data.address,
        price=event_data.price,
        categories=event_data.categories,
        description=event_data.description,
        organiser_id=event_data.organiser_id
    )
*/

export interface EventType {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  address: string ;
  price: string ;
  categories: number[] ;
  description: string ;
  organiser_id: number;
  images: string[];
}

export function mapRawEvent(raw: RawEvent): EventType {
  return {
    id: raw.event_id,
    title: raw.title,
    startDate: raw.start_date,
    endDate: raw.end_date,
    address: raw.address,
    price: raw.price,
    categories: raw.categories,
    description: raw.description,
    organiser_id: raw.organiser_id,
    images: raw.images,
  };
}

// In types/event.ts or types/timeline.ts
export type TravelMode = "transit" | "walking" | "bicycling" | "driving";

export type TimelineEntry =
  | { type: "event"; event: EventType; duration: number | null }
  | { type: "travel"; from: string; to: string; duration: number | null; mode: TravelMode };

  