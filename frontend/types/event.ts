// types/Event.ts
export interface RawEvent {
  id: string;
  Title: string;
  "Start Date": string | null;
  "End Date": string | null;
  "Price / Ticket Info": string | null;
  "Address / Location": string | null;
  Description: string | null;
  // ...add other fields as needed
}

export interface Event {
  id: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  price: string | null;
  address: string | null;
  description: string | null;
  // ...add other fields as needed
}

export function mapRawEvent(raw: RawEvent): Event {
  return {
    id: raw.id,
    title: raw.Title,
    startDate: raw["Start Date"],
    endDate: raw["End Date"],
    price: raw["Price / Ticket Info"],
    address: raw["Address / Location"],
    description: raw.Description,
    // ...map other fields as needed
  };
}
