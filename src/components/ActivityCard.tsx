import { memo } from "react";

import { IMAGE_DEFAULT_SIZE, type Activity } from "@/api/activities";

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard = memo(function ActivityCard({
  activity,
}: ActivityCardProps) {
  return (
    <a
      href={`https://www.sescsp.org.br${activity.link}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <article className="bg-card flex flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-lg">
        <img
          src={activity.imageUrl}
          alt={activity.title}
          width={IMAGE_DEFAULT_SIZE.width}
          height={IMAGE_DEFAULT_SIZE.height}
          className="w-full"
          loading="lazy"
        />
        <div className="flex h-full flex-col gap-4 p-5 pt-4">
          <div className="flex flex-col gap-1">
            <h1 className="line-clamp-2 h-14 text-lg font-semibold">
              {activity.title}
            </h1>
            <p className="text-muted-foreground line-clamp-2 h-10 text-sm">
              {activity.details}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold">{activity.branch}</p>
            <p className="font-mono text-sm">
              {new Date(activity.firstSessionDate).toLocaleDateString("pt-BR", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              })}
              {activity.firstSessionDate !== activity.lastSessionDate
                ? ` a ${new Date(activity.lastSessionDate).toLocaleDateString(
                    "pt-BR",
                    { year: "2-digit", month: "2-digit", day: "2-digit" },
                  )}`
                : ""}
            </p>
          </div>
        </div>
      </article>
    </a>
  );
});
