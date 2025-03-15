import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SelectedFiltersProps {
  selectedCategories: string[];
  selectedBranches: string[];
  onRemoveCategory: (category: string) => void;
  onRemoveBranch: (branch: string) => void;
}

export function SelectedFilters({
  selectedCategories,
  selectedBranches,
  onRemoveCategory,
  onRemoveBranch,
}: SelectedFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {selectedCategories.map((cat) => (
        <div
          key={cat}
          className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-sm"
        >
          {cat.replace(/\/categorias-atividades\//, "")}
          <Button
            onClick={() => onRemoveCategory(cat)}
            variant="ghost"
            size="sm"
            className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      ))}
      {selectedBranches.map((branch) => (
        <div
          key={branch}
          className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-sm"
        >
          {branch}
          <Button
            onClick={() => onRemoveBranch(branch)}
            variant="ghost"
            size="sm"
            className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      ))}
    </div>
  );
}
