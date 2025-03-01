import { Loader2 } from "lucide-react";

import { useActivitiesFiltering } from "@/hooks/useActivitiesFiltering";
import { ActivityCard } from "@/components/ActivityCard";
import { FilterBar } from "@/components/FilterBar";

export default function Activities() {
  const { activities, filteredActivities, setFilters, isPending, isError } =
    useActivitiesFiltering();

  if (isPending || !activities) {
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
      <FilterBar activities={activities} onFilterChange={setFilters} />

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
