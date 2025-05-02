import { memo } from "react";
import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EventGrid } from "@/components/EventGrid";
import { FilterBar } from "@/components/FilterBar";
import { useEventsFiltering } from "@/hooks/useEventsFiltering";

const EventsCount = memo<{
  filteredCount: number;
  totalCount: number;
}>(({ filteredCount, totalCount }) => (
  <p className="text-gray-500" role="status">
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

export function Events() {
  const {
    events,
    filteredEvents,
    branchesByRegion,
    categories,
    searchString,
    setSearchString,
    flushSearchString,
    hasFilters,
    resetFilters,
    branchesFilter,
    categoriesFilterSet,
    dateRange,
    setDateRange,
    error,
    handleAutocompleteSelection,
  } = useEventsFiltering();

  if (error) {
    return <ErrorState />;
  }

  if (!events || !filteredEvents || !categories || !branchesByRegion) {
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
        dateRange={dateRange}
        setDateRange={setDateRange}
        handleAutocompleteSelection={handleAutocompleteSelection}
      />

      <div aria-live="polite">
        <div className="mb-5 flex h-9 items-center justify-between gap-4">
          <EventsCount
            filteredCount={filteredEvents.length}
            totalCount={events.length}
          />
          {hasFilters && (
            <Button variant="ghost" onClick={resetFilters}>
              <X />
              <span>Limpar</span>
            </Button>
          )}
        </div>

        {filteredEvents.length === 0 ? (
          <NoResults />
        ) : (
          <EventGrid events={filteredEvents} />
        )}
      </div>
    </div>
  );
}
