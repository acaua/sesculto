import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, Command as CommandIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  const [showCommandK, setShowCommandK] = useState(true);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);

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

  // Show autocomplete when typing and hide when empty
  useEffect(() => {
    const hasResults =
      !!searchInputValue.trim() && autocompleteSuggestions.length > 0;
    setOpen(hasResults);
  }, [searchInputValue, autocompleteSuggestions]);

  // Set up keyboard shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Forward navigation key events from input to Command
  useEffect(() => {
    if (!open) return;

    const input = inputRef.current;
    const command = commandRef.current;
    if (!input || !command) return;

    const forwardKeys = ["ArrowUp", "ArrowDown", "Enter", "Escape"];

    const onKeyDown = (e: KeyboardEvent) => {
      if (forwardKeys.includes(e.key)) {
        e.preventDefault();

        // Clone the event for Command component
        const syntheticEvent = new KeyboardEvent("keydown", {
          key: e.key,
          bubbles: true,
        });
        command.dispatchEvent(syntheticEvent);

        // Close dropdown on Escape
        if (e.key === "Escape") {
          setOpen(false);
        }
      }
    };

    input.addEventListener("keydown", onKeyDown);
    return () => input.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const clearSearch = () => {
    setSearchInputValue("");
    setOpen(false);
  };

  return (
    <div className="relative flex-grow">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
        <input
          ref={inputRef}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 pr-10"
          placeholder="Buscar atividades, categorias ou unidades..."
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          onFocus={() => {
            if (searchInputValue.trim() && autocompleteSuggestions.length > 0) {
              setOpen(true);
            }
            setShowCommandK(false);
          }}
          onBlur={() => {
            if (!searchInputValue) {
              setShowCommandK(true);
            }
          }}
        />

        {showCommandK && (
          <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 bg-muted rounded px-1.5 py-0.5 text-xs text-muted-foreground flex items-center">
            <CommandIcon className="h-3 w-3 mr-1" />
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
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {/* Command menu for autocomplete */}
      {open && (
        <div className="absolute z-50 w-full mt-1 rounded-md shadow-md">
          <Command
            ref={commandRef}
            className="rounded-lg border shadow-md"
            shouldFilter={false}
            loop
          >
            <CommandList>
              {autocompleteSuggestions.length === 0 ? (
                <CommandEmpty>Nenhum resultado encontrado</CommandEmpty>
              ) : (
                <>
                  {autocompleteSuggestions.some(
                    (item) => item.type === "category",
                  ) && (
                    <CommandGroup heading="Categorias">
                      {autocompleteSuggestions
                        .filter((item) => item.type === "category")
                        .map((item) => (
                          <CommandItem
                            key={`cat-${item.value}`}
                            value={item.label}
                            onSelect={() => {
                              onAutocompleteSelection(item);
                              setOpen(false);
                              inputRef.current?.focus();
                            }}
                          >
                            <div
                              className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                              style={{
                                backgroundColor: item.color || "gray",
                              }}
                            />
                            {item.label}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  )}

                  {autocompleteSuggestions.some(
                    (item) => item.type === "branch",
                  ) && (
                    <CommandGroup heading="Unidades">
                      {autocompleteSuggestions
                        .filter((item) => item.type === "branch")
                        .map((item) => (
                          <CommandItem
                            key={`branch-${item.value}`}
                            value={item.label}
                            onSelect={() => {
                              onAutocompleteSelection(item);
                              setOpen(false);
                              inputRef.current?.focus();
                            }}
                          >
                            {item.label}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
