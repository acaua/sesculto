import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import queryClient from "@/lib/queryClient";
import { fetchActivities } from "@/api/activities";
import type { Activity } from "@/api/activities";
import { ActivityCard } from "@/components/ActivityCard";
import { FilterBar } from "@/components/FilterBar";

export default function Activities() {
  const { data, isPending, isError } = useQuery(
    {
      queryKey: ["activities"],
      queryFn: fetchActivities,
    },
    queryClient,
  );

  const [filters, setFilters] = useState({
    search: "",
    categorias: [] as string[],
    unidades: [] as string[],
  });

  const filteredActivities = useMemo(() => {
    if (!data) return [];

    return data.filter((activity) => {
      // Filter by search
      const matchesSearch =
        !filters.search ||
        activity.titulo.toLowerCase().includes(filters.search.toLowerCase()) ||
        activity.complemento
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      // Filter by categories
      const matchesCategories =
        filters.categorias.length === 0 ||
        activity.categorias.some((cat) =>
          filters.categorias.includes(cat.titulo),
        );

      // Filter by locations
      const matchesUnidades =
        filters.unidades.length === 0 ||
        activity.unidade.some((uni) => filters.unidades.includes(uni.name));

      return matchesSearch && matchesCategories && matchesUnidades;
    });
  }, [data, filters]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando atividades...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Erro ao carregar as atividades. Por favor, tente novamente mais tarde.
      </div>
    );
  }

  return (
    <div>
      <FilterBar activities={data} onFilterChange={setFilters} />

      {filteredActivities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            Nenhuma atividade encontrada com os filtros selecionados.
          </p>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-gray-500">
            {filteredActivities.length} atividades encontradas
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
