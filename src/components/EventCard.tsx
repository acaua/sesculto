import { memo } from "react";

import { IMAGE_DEFAULT_SIZE, type Event } from "@/api/events";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

export const EventCard = memo(function EventCard({ event }: EventCardProps) {
  return (
    <a
      href={`https://www.sescsp.org.br${event.link}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <article className="bg-card flex flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-lg">
        <img
          src={event.imageUrl}
          alt={event.title}
          width={IMAGE_DEFAULT_SIZE.width}
          height={IMAGE_DEFAULT_SIZE.height}
          className="aspect-[2/1] w-full object-cover"
          loading="lazy"
        />
        <div className="flex h-full flex-col gap-4 p-5 pt-4">
          <div className="flex flex-col gap-1">
            <h1 className="line-clamp-2 h-14 text-lg font-semibold">
              {event.title}
            </h1>
            <p className="text-muted-foreground line-clamp-2 h-10 text-sm">
              {event.details}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold">{event.branch}</p>
            <p className="font-mono text-sm">
              {formatDate(event.firstSessionDate)}
              {event.firstSessionDate !== event.lastSessionDate
                ? ` a ${formatDate(event.lastSessionDate)}`
                : ""}
            </p>
          </div>
        </div>
      </article>
    </a>
  );
});
