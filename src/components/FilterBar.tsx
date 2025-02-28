import { useState, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Activity } from "@/api/activities";

interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

interface FilterBarProps {
  activities: Activity[];
  onFilterChange: (filters: {
    search: string;
    categorias: string[];
    unidades: string[];
  }) => void;
}

export function FilterBar({ activities, onFilterChange }: FilterBarProps) {
  const [search, setSearch] = useState("");
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
  const [selectedUnidades, setSelectedUnidades] = useState<string[]>([]);

  // Extract unique categories and locations from activities
  const categorias: FilterOption[] = [];
  const unidades: FilterOption[] = [];

  for (const activity of activities) {
    for (const cat of activity.categorias) {
      if (!categorias.some((c) => c.value === cat.titulo)) {
        categorias.push({
          value: cat.titulo,
          label: cat.titulo,
          color: cat.cor,
        });
      }
    }

    for (const uni of activity.unidade) {
      if (!unidades.some((u) => u.value === uni.name)) {
        unidades.push({
          value: uni.name,
          label: uni.name,
        });
      }
    }
  }

  // Sort alphabetically
  categorias.sort((a, b) => a.label?.localeCompare(b.label));
  unidades.sort((a, b) => a.label?.localeCompare(b.label));

  useEffect(() => {
    onFilterChange({
      search,
      categorias: selectedCategorias,
      unidades: selectedUnidades,
    });
  }, [search, selectedCategorias, selectedUnidades, onFilterChange]);

  const resetFilters = () => {
    setSearch("");
    setSelectedCategorias([]);
    setSelectedUnidades([]);
  };

  const hasFilters =
    search || selectedCategorias.length > 0 || selectedUnidades.length > 0;

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 py-4 border-b mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar atividades..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
              {categorias.map((categoria) => (
                <DropdownMenuCheckboxItem
                  key={categoria.value}
                  checked={selectedCategorias.includes(categoria.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategorias([
                        ...selectedCategorias,
                        categoria.value,
                      ]);
                    } else {
                      setSelectedCategorias(
                        selectedCategorias.filter((c) => c !== categoria.value),
                      );
                    }
                  }}
                >
                  <div className="flex items-center">
                    {categoria.color && (
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: categoria.color }}
                      />
                    )}
                    {categoria.label}
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
              {unidades.map((unidade) => (
                <DropdownMenuCheckboxItem
                  key={unidade.value}
                  checked={selectedUnidades.includes(unidade.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedUnidades([...selectedUnidades, unidade.value]);
                    } else {
                      setSelectedUnidades(
                        selectedUnidades.filter((u) => u !== unidade.value),
                      );
                    }
                  }}
                >
                  {unidade.label}
                </DropdownMenuCheckboxItem>
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
          {selectedCategorias.map((cat) => (
            <div
              key={cat}
              className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-sm"
            >
              {cat}
              <Button
                onClick={() =>
                  setSelectedCategorias(
                    selectedCategorias.filter((c) => c !== cat),
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
          {selectedUnidades.map((uni) => (
            <div
              key={uni}
              className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-sm"
            >
              {uni}
              <Button
                onClick={() =>
                  setSelectedUnidades(selectedUnidades.filter((u) => u !== uni))
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
