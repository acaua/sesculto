import { Loader2 } from "lucide-react";

import { useActivitiesFiltering } from "@/hooks/useActivitiesFiltering";
import { ActivityCard } from "@/components/ActivityCard";
import { FilterBar } from "@/components/FilterBar";

export function Activities() {
  const {
    activities,
    filteredActivities,
    allBranches,
    regionOptions,
    categories,
    searchString,
    setSearchString,
    hasFilters,
    resetFilters,
    branchesFilterSet,
    categoriesFilterSet,
    error,
    handleRegionSelection,
    handleAutocompleteSelection,
  } = useActivitiesFiltering();

  if (!activities || !filteredActivities || !categories) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando atividades...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        Erro ao carregar as atividades. Por favor, tente novamente mais tarde.
      </div>
    );
  }

  return (
    <div>
      <FilterBar
        allBranches={allBranches}
        regionOptions={regionOptions}
        categories={categories}
        searchString={searchString}
        setSearchString={setSearchString}
        hasFilters={hasFilters}
        resetFilters={resetFilters}
        branchesFilterSet={branchesFilterSet}
        categoriesFilterSet={categoriesFilterSet}
        handleRegionSelection={handleRegionSelection}
        handleAutocompleteSelection={handleAutocompleteSelection}
      />

      {filteredActivities.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-xl text-gray-500">
            Nenhuma atividade encontrada com os filtros selecionados.
          </p>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-gray-500">
            {filteredActivities.length < activities.length &&
              `${filteredActivities.length} de `}
            {activities.length} atividades encontradas
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
