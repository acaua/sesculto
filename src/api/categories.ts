import type { Event } from "@/api/events";

export const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch("https://sescontent.acaua.dev/categories.json");

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const categories: string[] = await response.json();

  return categories;
};

export function extractUniqueCategories(events: Event[]): string[] {
  const categoriesSet = new Set<string>();

  for (const event of events) {
    for (const category of event.categories) {
      categoriesSet.add(category);
    }
  }

  const categories = Array.from(categoriesSet);

  // Sort alphabetically
  return categories.sort((a, b) => a.localeCompare(b));
}

export function getCategoryNameFromLink(category: string): string {
  return category.replace(/\/categorias-atividades\//, "").replaceAll("-", " ");
}
