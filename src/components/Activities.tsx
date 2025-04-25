import { memo } from "react";
import { Loader2 } from "lucide-react";

import { ActivityCard } from "@/components/ActivityCard";
import { FilterBar } from "@/components/FilterBar";
import { useActivitiesFiltering } from "@/hooks/useActivitiesFiltering";
import type { Activity } from "@/api/activities";

const ActivitiesCount = memo<{
  filteredCount: number;
  totalCount: number;
}>(({ filteredCount, totalCount }) => (
  <p className="mb-4 text-gray-500" role="status">
    {filteredCount < totalCount
      ? `${filteredCount} de ${totalCount} atividades encontradas`
      : `${totalCount} atividades encontradas`}
  </p>
));

const NoResults = memo(() => (
  <div className="py-12 text-center">
    <p className="text-xl text-gray-500">
      Nenhuma atividade encontrada com os filtros selecionados.
    </p>
  </div>
));

const ActivityGrid = memo<{ activities: Activity[] }>(({ activities }) => (
  <div
    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    role="list"
    aria-label="Lista de atividades"
  >
    {activities.map((activity) => (
      <div key={activity.id} role="listitem">
        <ActivityCard activity={activity} />
      </div>
    ))}
  </div>
));

const LoadingState = () => (
  <div className="flex h-64 items-center justify-center" aria-live="polite">
    <Loader2 className="text-primary h-8 w-8 animate-spin" aria-hidden="true" />
    <span className="ml-2">Carregando atividades...</span>
  </div>
);

const ErrorState = () => (
  <div
    className="flex h-64 flex-col items-center justify-center text-red-500"
    aria-live="assertive"
  >
    <p>
      Erro ao carregar as atividades. Por favor, tente novamente mais tarde.
    </p>
  </div>
);

export function Activities() {
  const {
    activities,
    filteredActivities,
    branchesByRegion,
    categories,
    searchString,
    setSearchString,
    flushSearchString,
    hasFilters,
    resetFilters,
    branchesFilter,
    categoriesFilterSet,
    error,
    handleAutocompleteSelection,
  } = useActivitiesFiltering();

  if (error) {
    return <ErrorState />;
  }

  if (!activities || !filteredActivities || !categories || !branchesByRegion) {
    return <LoadingState />;
  }

  return (
    <div role="main" aria-label="Atividades SESC">
      <FilterBar
        branchesByRegion={branchesByRegion}
        categories={categories}
        searchString={searchString}
        setSearchString={setSearchString}
        flushSearchString={flushSearchString}
        hasFilters={hasFilters}
        resetFilters={resetFilters}
        branchesFilter={branchesFilter}
        categoriesFilterSet={categoriesFilterSet}
        handleAutocompleteSelection={handleAutocompleteSelection}
      />

      <div aria-live="polite">
        <ActivitiesCount
          filteredCount={filteredActivities.length}
          totalCount={activities.length}
        />

        {filteredActivities.length === 0 ? (
          <NoResults />
        ) : (
          <ActivityGrid activities={filteredActivities} />
        )}
      </div>
    </div>
  );
}
