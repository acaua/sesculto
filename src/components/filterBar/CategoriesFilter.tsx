import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoriesFilterProps {
  categories: { value: string; label: string; color?: string }[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

export function CategoriesFilter({
  categories,
  selectedCategories,
  setSelectedCategories,
}: CategoriesFilterProps) {
  const numSelectedCategories = selectedCategories.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-between w-40"
        >
          <div className="flex items-center gap-2">
            Categorias
            {numSelectedCategories > 0 && (
              <div className="flex justify-center items-center rounded-full bg-blue-100 w-6 h-6">
                {numSelectedCategories}
              </div>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-80 overflow-auto">
        {categories.map((category) => (
          <DropdownMenuCheckboxItem
            key={category.value}
            checked={selectedCategories.includes(category.value)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedCategories([...selectedCategories, category.value]);
              } else {
                setSelectedCategories(
                  selectedCategories.filter((c) => c !== category.value),
                );
              }
            }}
            onSelect={(event) => event.preventDefault()}
          >
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2 bg-gray-600"
                style={
                  category.color ? { backgroundColor: category.color } : {}
                }
              />
              {category.label}
            </div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
