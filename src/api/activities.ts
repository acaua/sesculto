export const IMAGE_DEFAULT_SIZE = { width: 320, height: 160 };

export interface Activity {
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

export const fetchActivities = async (): Promise<Activity[]> => {
  const response = await fetch("https://sescontent.acaua.dev/activities.json");

  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }

  const activities: Activity[] = await response.json();

  return activities;
};
