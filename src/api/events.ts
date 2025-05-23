export const IMAGE_DEFAULT_SIZE = { width: 320, height: 160 };
import type { DateRange } from "@/components/DatePickerWithRange";

export interface Event {
  id: number;
  title: string;
  details: string;
  imageUrl: string;
  link: string;
  firstSessionDate: string;
  lastSessionDate: string;
  branch: string;
  categories: Array<string>;
}

export const fetchEvents = async (): Promise<Event[]> => {
  const response = await fetch("https://sescontent.acaua.dev/events.json");

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const events: Event[] = await response.json();

  return events;
};

export function isEventInDateRange(
  event: Event,
  dateRange: DateRange,
): boolean {
  function normalizeToDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const eventFirstDate = normalizeToDay(new Date(event.firstSessionDate));
  const eventLastDate = normalizeToDay(new Date(event.lastSessionDate));

  // If range.from is defined and the event ends before the range starts → no overlap
  if (dateRange.from && eventLastDate < dateRange.from) return false;

  // If dateRange.to is defined and the event starts after the range ends → no overlap
  if (dateRange.to && eventFirstDate > dateRange.to) return false;

  // Otherwise, there's some overlap
  return true;
}
