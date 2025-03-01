import {
  useState,
  useEffect,
  useMemo,
  useRef,
  type KeyboardEvent,
} from "react";
import { ChevronDown, Search, X, Command } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import type { FilterState } from "@/hooks/useActivitiesFiltering";
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
  type: "category" | "branch";
}

interface RegionOption {
  name: string;
  branches: Omit<FilterOption, "type">[];
}

interface FilterBarProps {
  activities: Activity[];
  onFilterChange: (filters: FilterState) => void;
}

export function FilterBar({ activities, onFilterChange }: FilterBarProps) {
  const [searchInputValue, setSearchInputValue] = useState(""); // For immediate input feedback
  const [search, setSearch] = useState(""); // Debounced search value for filtering
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showCommandK, setShowCommandK] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Fetch branches using React Query
  const { data: branchesData } = useQuery(
    {
      queryKey: ["branches"],
      queryFn: fetchBranches,
    },
    queryClient,
  );

  // Extract unique categories from activities and memoize
  const categories = useMemo<Omit<FilterOption, "type">[]>(() => {
    const uniqueCategories: Omit<FilterOption, "type">[] = [];

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

    const transformBranches = (
      branches: Branch[],
    ): Omit<FilterOption, "type">[] =>
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

  // All branches flattened into a single array for autocomplete
  const allBranches = useMemo(() => {
    return regionOptions.flatMap((region) => region.branches);
  }, [regionOptions]);

  // Filtered autocomplete suggestions
  const autocompleteSuggestions = useMemo(() => {
    if (!searchInputValue.trim()) return [];

    const lowerSearch = searchInputValue.toLowerCase();

    const filteredCategories = categories
      .filter((cat) => cat.label.toLowerCase().includes(lowerSearch))
      .slice(0, 5)
      .map((cat) => ({ ...cat, type: "category" as const }));

    const filteredBranches = allBranches
      .filter((branch) => branch.label.toLowerCase().includes(lowerSearch))
      .slice(0, 5)
      .map((branch) => ({ ...branch, type: "branch" as const }));

    return [...filteredCategories, ...filteredBranches];
  }, [searchInputValue, categories, allBranches]);

  const hasAutocompleteSuggestions = useMemo(() => {
    return autocompleteSuggestions.length > 0;
  }, [autocompleteSuggestions]);

  // Reset highlighted index when suggestions change
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [autocompleteSuggestions]);

  // Debounce search input
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setSearch(searchInputValue);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchInputValue]);

  // Show autocomplete when typing and hide when empty
  useEffect(() => {
    if (searchInputValue.trim() && hasAutocompleteSuggestions) {
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }
  }, [searchInputValue, hasAutocompleteSuggestions]);

  // Update parent component with filters
  useEffect(() => {
    onFilterChange({
      search,
      categories: selectedCategories,
      branches: selectedBranches,
    });
  }, [search, selectedCategories, selectedBranches, onFilterChange]);

  // Handle click outside to close autocomplete
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Set up keyboard shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent<Element>) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
        setShowCommandK(false);
      }

      // Also handle Escape key to dismiss command-k indicator
      if (event.key === "Escape" && showCommandK) {
        setShowCommandK(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown as unknown as EventListener,
    );

    // Show command-k indicator when page loads
    setShowCommandK(true);

    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      setShowCommandK(false);
    }, 5000);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown as unknown as EventListener,
      );
      clearTimeout(timer);
    };
  }, [showCommandK]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && autocompleteRef.current) {
      const highlightedElement = autocompleteRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`,
      ) as HTMLElement;

      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  const resetFilters = () => {
    setSearchInputValue("");
    setSearch("");
    setSelectedCategories([]);
    setSelectedBranches([]);
  };

  const clearSearch = () => {
    setSearchInputValue("");
    setSearch("");
    setShowAutocomplete(false);
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

  const handleAutocompleteSelection = (item: FilterOption) => {
    if (item.type === "category") {
      if (!selectedCategories.includes(item.value)) {
        setSelectedCategories([...selectedCategories, item.value]);
      }
    } else {
      if (!selectedBranches.includes(item.value)) {
        setSelectedBranches([...selectedBranches, item.value]);
      }
    }
    setSearchInputValue("");
    setShowAutocomplete(false);
    setHighlightedIndex(-1);
    searchInputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showAutocomplete || autocompleteSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex < autocompleteSuggestions.length - 1 ? prevIndex + 1 : 0,
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : autocompleteSuggestions.length - 1,
        );
        break;

      case "Enter":
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < autocompleteSuggestions.length
        ) {
          handleAutocompleteSelection(
            autocompleteSuggestions[highlightedIndex],
          );
        }
        break;

      case "Escape":
        e.preventDefault();
        setShowAutocomplete(false);
        setHighlightedIndex(-1);
        break;

      case "Tab":
        setShowAutocomplete(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const hasFilters =
    search || selectedCategories.length > 0 || selectedBranches.length > 0;

  // Group autocomplete suggestions by type
  const categorySuggestions = autocompleteSuggestions.filter(
    (item) => item.type === "category",
  );
  const branchSuggestions = autocompleteSuggestions.filter(
    (item) => item.type === "branch",
  );

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 py-4 border-b mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            ref={searchInputRef}
            placeholder="Buscar atividades, categorias ou unidades..."
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10"
            onFocus={() => {
              if (searchInputValue.trim() && hasAutocompleteSuggestions) {
                setShowAutocomplete(true);
              }
              setShowCommandK(false);
            }}
            aria-expanded={showAutocomplete}
            aria-autocomplete="list"
            aria-controls="autocomplete-options"
            role="combobox"
          />

          {/* Command+K Indicator */}
          {showCommandK && !searchInputValue && (
            <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Command className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">K</span>
            </div>
          )}

          {searchInputValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            >
              <X className="h-4 w-4 text-gray-400" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}

          {/* Autocomplete dropdown */}
          {showAutocomplete && (
            <div
              ref={autocompleteRef}
              id="autocomplete-options"
              className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto"
            >
              {categorySuggestions.length > 0 && (
                <div>
                  <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Categorias
                  </div>
                  {categorySuggestions.map((cat) => {
                    const globalIndex = autocompleteSuggestions.findIndex(
                      (item) =>
                        item.value === cat.value && item.type === cat.type,
                    );

                    return (
                      <Button
                        key={`cat-${cat.value}`}
                        type="button"
                        data-index={globalIndex}
                        aria-selected={highlightedIndex === globalIndex}
                        variant="ghost"
                        className={`flex items-center px-2 py-1.5 w-full text-left justify-start h-auto rounded-none ${
                          highlightedIndex === globalIndex
                            ? "bg-blue-100 dark:bg-blue-900"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => handleAutocompleteSelection(cat)}
                        onMouseEnter={() => setHighlightedIndex(globalIndex)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleAutocompleteSelection(cat);
                          }
                        }}
                      >
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={
                            cat.color
                              ? { backgroundColor: cat.color }
                              : { backgroundColor: "gray" }
                          }
                        />
                        <span>{cat.label}</span>
                      </Button>
                    );
                  })}
                </div>
              )}

              {branchSuggestions.length > 0 && (
                <div>
                  {categorySuggestions.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                  )}
                  <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Unidades
                  </div>
                  {branchSuggestions.map((branch) => {
                    const globalIndex = autocompleteSuggestions.findIndex(
                      (item) =>
                        item.value === branch.value &&
                        item.type === branch.type,
                    );

                    return (
                      <Button
                        key={`branch-${branch.value}`}
                        type="button"
                        data-index={globalIndex}
                        aria-selected={highlightedIndex === globalIndex}
                        variant="ghost"
                        className={`flex items-center px-2 py-1.5 w-full text-left justify-start h-auto rounded-none ${
                          highlightedIndex === globalIndex
                            ? "bg-blue-100 dark:bg-blue-900"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => handleAutocompleteSelection(branch)}
                        onMouseEnter={() => setHighlightedIndex(globalIndex)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleAutocompleteSelection(branch);
                          }
                        }}
                      >
                        <span>{branch.label}</span>
                      </Button>
                    );
                  })}
                </div>
              )}

              {autocompleteSuggestions.length === 0 && (
                <div className="px-2 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                  Nenhum resultado encontrado
                </div>
              )}
            </div>
          )}
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
