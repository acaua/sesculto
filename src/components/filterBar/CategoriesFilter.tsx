import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type StatefulSet } from "@/hooks/useSet";

interface CategoriesFilterProps {
  categories: string[];
  categoriesFilterSet: StatefulSet<string>;
}

export function CategoriesFilter({
  categories,
  categoriesFilterSet,
}: CategoriesFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex w-40 items-center justify-between"
        >
          <div className="flex items-center gap-2">
            Categorias
            {categoriesFilterSet.size > 0 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                {categoriesFilterSet.size}
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
            checked={categoriesFilterSet.has(category)}
            onCheckedChange={(checked) => {
              if (checked) {
                categoriesFilterSet.add(category);
              } else {
                categoriesFilterSet.delete(category);
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
