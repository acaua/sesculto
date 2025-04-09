export interface Activity {
  id: number;
  title: string;
  details: string;
  image: Image;
  link: string;
  nextSessionDate: string;
  firstSessionDate: string;
  lastSessionDate: string;
  branch: string;
  categories: Array<string>;
}

export interface Image {
  url: string;
  width: number;
  height: number;
}

export const fetchActivities = async (): Promise<Activity[]> => {
  const response = await fetch("https://sescontent.acaua.dev/activities.json");

  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }

  const activities: Activity[] = await response.json();

  return activities;
};
