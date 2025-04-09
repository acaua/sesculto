import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoriesFilterProps {
  categories: string[];
  selectedCategories: string[];
  addCategoryToFilters: (category: string) => void;
  removeCategoryFromFilters: (category: string) => void;
}

export function CategoriesFilter({
  categories,
  selectedCategories,
  addCategoryToFilters,
  removeCategoryFromFilters,
}: CategoriesFilterProps) {
  const numSelectedCategories = selectedCategories.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex w-40 items-center justify-between"
        >
          <div className="flex items-center gap-2">
            Categorias
            {numSelectedCategories > 0 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                {numSelectedCategories}
              </div>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-80 w-56 overflow-auto">
        {categories.map((category) => (
          <DropdownMenuCheckboxItem
            key={category}
            checked={selectedCategories.includes(category)}
            onCheckedChange={(checked) => {
              if (checked) {
                addCategoryToFilters(category);
              } else {
                removeCategoryFromFilters(category);
              }
            }}
            onSelect={(event) => event.preventDefault()}
          >
            <div className="flex items-center">{category}</div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
