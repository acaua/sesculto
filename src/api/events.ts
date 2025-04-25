export const IMAGE_DEFAULT_SIZE = { width: 320, height: 160 };

export interface Event {
  id: number;
  title: string;
  details: string;
  imageUrl: string;
  link: string;
  nextSessionDate: string;
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
