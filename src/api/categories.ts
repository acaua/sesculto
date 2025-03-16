import type { Activity } from "@/api/activities";

export interface CategoryOption {
  value: string;
  label: string;
  color?: string;
}

export function extractUniqueCategories(
  activities: Activity[],
): CategoryOption[] {
  const uniqueCategories: CategoryOption[] = [];

  for (const activity of activities) {
    for (const cat of activity.categorias) {
      if (!uniqueCategories.some((c) => c.value === cat.link)) {
        uniqueCategories.push({
          value: cat.link,
          label: getCategoryLabel(cat.link),
          color: cat.cor,
        });
      }
    }
  }

  // Sort alphabetically
  return uniqueCategories.sort((a, b) => a.label.localeCompare(b.label));
}

export function getCategoryLabel(category: string): string {
  return category.replace(/\/categorias-atividades\//, "");
}
