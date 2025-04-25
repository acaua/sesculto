import { memo } from "react";
import { Loader2 } from "lucide-react";

import { EventCard } from "@/components/EventCard";
import { FilterBar } from "@/components/FilterBar";
import { useEventsFiltering } from "@/hooks/useEventsFiltering";
import type { Event } from "@/api/events";

const EventsCount = memo<{
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

const EventGrid = memo<{ events: Event[] }>(({ events }) => (
  <div
    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    role="list"
    aria-label="Lista de atividades"
  >
    {events.map((event) => (
      <div key={event.id} role="listitem">
        <EventCard event={event} />
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
        handleAutocompleteSelection={handleAutocompleteSelection}
      />

      <div aria-live="polite">
        <EventsCount
          filteredCount={filteredEvents.length}
          totalCount={events.length}
        />

        {filteredEvents.length === 0 ? (
          <NoResults />
        ) : (
          <EventGrid events={filteredEvents} />
        )}
      </div>
    </div>
  );
}
