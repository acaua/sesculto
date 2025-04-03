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
  categories: string[];
  allBranches: string[];
  onAutocompleteSelection: (item: FilterOption) => void;
  onEnterPress: () => void;
}

export function SearchBar({
  categories,
  searchInputValue,
  setSearchInputValue,
  allBranches,
  onAutocompleteSelection,
  onEnterPress,
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
      .filter((category) => category.toLowerCase().includes(lowerSearch))
      .slice(0, 5)
      .map((category) => ({ value: category, type: "category" as const }));

    const filteredBranches = allBranches
      .filter((branch) => branch.toLowerCase().includes(lowerSearch))
      .slice(0, 5)
      .map((branch) => ({ value: branch, type: "branch" as const }));

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

  // Handle "Enter" key press in the search bar itself (not in the command menu)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnterPress();
      setOpen(false);
    } else if (e.key === "Escape") {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative flex-grow">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 transform" />
        <input
          ref={inputRef}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 pr-10 pl-10 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
          onKeyDown={handleInputKeyDown}
        />

        {showCommandK && (
          <div className="bg-muted text-muted-foreground absolute top-1/2 right-2.5 flex -translate-y-1/2 transform items-center rounded px-1.5 py-0.5 text-xs">
            <CommandIcon className="mr-1 h-3 w-3" />
            <span className="hidden sm:inline">K</span>
          </div>
        )}

        {searchInputValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute top-1/2 right-2 h-7 w-7 -translate-y-1/2 transform p-0"
          >
            <X className="text-muted-foreground h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {/* Command menu for autocomplete */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md shadow-md">
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
                            value={item.value}
                            onSelect={() => {
                              onAutocompleteSelection(item);
                              setOpen(false);
                              inputRef.current?.focus();
                            }}
                          >
                            {item.value}
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
                            value={item.value}
                            onSelect={() => {
                              onAutocompleteSelection(item);
                              setOpen(false);
                              inputRef.current?.focus();
                            }}
                          >
                            {item.value}
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
