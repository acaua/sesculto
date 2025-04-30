import { memo, useEffect } from "react";

import { EventCard } from "@/components/EventCard";
import type { Event } from "@/api/events";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export interface EventGridProps {
  events: Event[];
}

export const EventGrid = memo<EventGridProps>(({ events }) => {
  const { visibleItems, loaderRef } = useInfiniteScroll<Event>(events);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [events]);

  return (
    <>
      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        role="list"
        aria-label="Lista de atividades"
      >
        {visibleItems.map((event) => (
          <div key={event.id} role="listitem">
            <EventCard event={event} />
          </div>
        ))}
      </div>

      <div ref={loaderRef} style={{ height: 1 }} aria-hidden="true" />
    </>
  );
});
