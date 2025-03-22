import { type Activity, getActivityImage } from "@/api/activities";

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const image = getActivityImage(activity);

  return (
    <a
      href={`https://www.sescsp.org.br${activity.link}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <article className="bg-card flex flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-lg">
        <img
          src={image.url}
          alt={activity.titulo}
          width={image.width}
          height={image.height}
          className="w-full"
          loading="lazy"
        />
        <div className="flex h-full flex-col gap-4 p-5 pt-4">
          <div className="flex flex-col gap-1">
            <h1 className="line-clamp-2 h-14 text-lg font-semibold">
              {activity.titulo}
            </h1>
            <p className="text-muted-foreground line-clamp-2 h-10 text-sm">
              {activity.complemento}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold">
              {activity.unidade.map((u) => u.name).join(", ")}
            </p>
            <p className="font-mono text-sm">
              {new Date(activity.dataPrimeiraSessao).toLocaleDateString(
                "pt-BR",
                { year: "2-digit", month: "2-digit", day: "2-digit" },
              )}
              {activity.dataPrimeiraSessao !== activity.dataUltimaSessao
                ? ` a ${new Date(activity.dataUltimaSessao).toLocaleDateString(
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
}
