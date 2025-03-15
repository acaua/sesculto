import {
  useState,
  useRef,
  useEffect,
  useMemo,
  type KeyboardEvent,
} from "react";
import { Search, X, Command } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { FilterOption } from "@/components/FilterBar";

interface SearchBarProps {
  searchInputValue: string;
  setSearchInputValue: (value: string) => void;
  categories: Omit<FilterOption, "type">[];
  allBranches: { value: string; label: string }[];
  onAutocompleteSelection: (item: FilterOption) => void;
}

export function SearchBar({
  searchInputValue,
  setSearchInputValue,
  categories,
  allBranches,
  onAutocompleteSelection,
}: SearchBarProps) {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showCommandK, setShowCommandK] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

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
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [autocompleteSuggestions]);

  // Show autocomplete when typing and hide when empty
  useEffect(() => {
    if (searchInputValue.trim() && hasAutocompleteSuggestions) {
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }
  }, [searchInputValue, hasAutocompleteSuggestions]);

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

  const clearSearch = () => {
    setSearchInputValue("");
    setShowAutocomplete(false);
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
          onAutocompleteSelection(autocompleteSuggestions[highlightedIndex]);
          setShowAutocomplete(false);
          setHighlightedIndex(-1);
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

  // Group autocomplete suggestions by type
  const categorySuggestions = autocompleteSuggestions.filter(
    (item) => item.type === "category",
  );
  const branchSuggestions = autocompleteSuggestions.filter(
    (item) => item.type === "branch",
  );

  return (
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
                  (item) => item.value === cat.value && item.type === cat.type,
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
                    onClick={() => {
                      onAutocompleteSelection(cat);
                      setShowAutocomplete(false);
                      setHighlightedIndex(-1);
                      searchInputRef.current?.focus();
                    }}
                    onMouseEnter={() => setHighlightedIndex(globalIndex)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onAutocompleteSelection(cat);
                        setShowAutocomplete(false);
                        setHighlightedIndex(-1);
                        searchInputRef.current?.focus();
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
                    item.value === branch.value && item.type === branch.type,
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
                    onClick={() => {
                      onAutocompleteSelection(branch);
                      setShowAutocomplete(false);
                      setHighlightedIndex(-1);
                      searchInputRef.current?.focus();
                    }}
                    onMouseEnter={() => setHighlightedIndex(globalIndex)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onAutocompleteSelection(branch);
                        setShowAutocomplete(false);
                        setHighlightedIndex(-1);
                        searchInputRef.current?.focus();
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
  );
}
