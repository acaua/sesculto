import { useState, useEffect, useMemo } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import queryClient from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Activity } from "@/api/activities";
import { fetchBranches, type Branch } from "@/api/branches";

interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

interface RegionOption {
  name: string;
  branches: FilterOption[];
}

interface FilterBarProps {
  activities: Activity[];
  onFilterChange: (filters: {
    search: string;
    categories: string[];
    branches: string[];
  }) => void;
}

export function FilterBar({ activities, onFilterChange }: FilterBarProps) {
  const [searchInputValue, setSearchInputValue] = useState(""); // For immediate input feedback
  const [search, setSearch] = useState(""); // Debounced search value for filtering
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  // Fetch branches using React Query
  const { data: branchesData } = useQuery(
    {
      queryKey: ["branches"],
      queryFn: fetchBranches,
    },
    queryClient,
  );

  // Extract unique categories from activities and memoize
  const categories = useMemo<FilterOption[]>(() => {
    const uniqueCategories: FilterOption[] = [];

    for (const activity of activities) {
      for (const cat of activity.categorias) {
        if (!uniqueCategories.some((c) => c.value === cat.link)) {
          uniqueCategories.push({
            value: cat.link,
            label: cat.link.replace(/\/categorias-atividades\//, ""),
            color: cat.cor,
          });
        }
      }
    }

    // Sort alphabetically
    return uniqueCategories.sort((a, b) => a.label.localeCompare(b.label));
  }, [activities]);

  // Transform branchesData to RegionOption
  const regionOptions = useMemo<RegionOption[]>(() => {
    if (!branchesData) return [];

    const transformBranches = (branches: Branch[]): FilterOption[] =>
      branches
        .map((branch) => ({
          value: branch.groupName,
          label: branch.groupName,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const regions: RegionOption[] = [];

    if (branchesData.capital.length > 0) {
      regions.push({
        name: "Capital",
        branches: transformBranches(branchesData.capital),
      });
    }

    if (branchesData.interior.length > 0) {
      regions.push({
        name: "Interior",
        branches: transformBranches(branchesData.interior),
      });
    }

    if (branchesData.litoral.length > 0) {
      regions.push({
        name: "Litoral",
        branches: transformBranches(branchesData.litoral),
      });
    }

    return regions;
  }, [branchesData]);

  // Debounce search input
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setSearch(searchInputValue);
    }, 500); // 300ms debounce delay

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchInputValue]);

  // Update parent component with filters
  useEffect(() => {
    onFilterChange({
      search,
      categories: selectedCategories,
      branches: selectedBranches,
    });
  }, [search, selectedCategories, selectedBranches, onFilterChange]);

  const resetFilters = () => {
    setSearchInputValue("");
    setSearch("");
    setSelectedCategories([]);
    setSelectedBranches([]);
  };

  const handleRegionSelection = (regionName: string, isSelected: boolean) => {
    const region = regionOptions.find((r) => r.name === regionName);
    if (!region) return;

    const branchValues = region.branches.map((b) => b.value);

    if (isSelected) {
      // Add all branches of the region that aren't already selected
      setSelectedBranches([
        ...selectedBranches,
        ...branchValues.filter((b) => !selectedBranches.includes(b)),
      ]);
    } else {
      // Remove all branches of the region
      setSelectedBranches(
        selectedBranches.filter((b) => !branchValues.includes(b)),
      );
    }
  };

  const isRegionSelected = (regionName: string): boolean => {
    const region = regionOptions.find((r) => r.name === regionName);
    if (!region) return false;

    const regionBranchValues = region.branches.map((b) => b.value);
    return regionBranchValues.every((b) => selectedBranches.includes(b));
  };

  const isRegionPartiallySelected = (regionName: string): boolean => {
    const region = regionOptions.find((r) => r.name === regionName);
    if (!region) return false;

    const regionBranchValues = region.branches.map((b) => b.value);
    return (
      regionBranchValues.some((b) => selectedBranches.includes(b)) &&
      !regionBranchValues.every((b) => selectedBranches.includes(b))
    );
  };

  const hasFilters =
    search || selectedCategories.length > 0 || selectedBranches.length > 0;

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 py-4 border-b mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar atividades..."
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Categorias <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-80 overflow-auto">
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.value}
                  checked={selectedCategories.includes(category.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([
                        ...selectedCategories,
                        category.value,
                      ]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter((c) => c !== category.value),
                      );
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2 bg-gray-600"
                      style={
                        category.color
                          ? { backgroundColor: category.color }
                          : {}
                      }
                    />
                    {category.label}
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Unidades <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-80 overflow-auto">
              {regionOptions.map((region) => (
                <div key={region.name}>
                  <DropdownMenuLabel className="font-bold">
                    <DropdownMenuCheckboxItem
                      checked={isRegionSelected(region.name)}
                      onCheckedChange={(checked) => {
                        handleRegionSelection(region.name, checked);
                      }}
                      className={
                        isRegionPartiallySelected(region.name)
                          ? "bg-gray-100 dark:bg-gray-800"
                          : ""
                      }
                    >
                      {region.name}
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {region.branches.map((branch) => (
                    <DropdownMenuCheckboxItem
                      key={branch.value}
                      checked={selectedBranches.includes(branch.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBranches([
                            ...selectedBranches,
                            branch.value,
                          ]);
                        } else {
                          setSelectedBranches(
                            selectedBranches.filter((b) => b !== branch.value),
                          );
                        }
                      }}
                    >
                      {branch.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                  {region !== regionOptions[regionOptions.length - 1] && (
                    <DropdownMenuSeparator />
                  )}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasFilters && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="flex items-center"
            >
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Show selected filters as pills */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedCategories.map((cat) => (
            <div
              key={cat}
              className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-sm"
            >
              {cat.replace(/\/categorias-atividades\//, "")}
              <Button
                onClick={() =>
                  setSelectedCategories(
                    selectedCategories.filter((c) => c !== cat),
                  )
                }
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
                onClick={() =>
                  setSelectedBranches(
                    selectedBranches.filter((b) => b !== branch),
                  )
                }
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
      )}
    </div>
  );
}
