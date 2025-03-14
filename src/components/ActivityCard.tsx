import { Badge } from "@/components/ui/badge";
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
      <div className="overflow-hidden h-[420px] bg-card flex flex-col rounded-xl border shadow-sm transition-shadow hover:shadow-lg">
        <img
          src={image.url}
          alt={activity.titulo}
          width={image.width}
          height={image.height}
          className="w-full hover:scale-105 transition-transform duration-300"
        />
        <div className="flex flex-col justify-between h-full gap-5 p-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="leading-none font-semibold text-lg line-clamp-2 mb-2">
                {activity.titulo}
              </h1>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {activity.complemento}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {activity.categorias.map((categoria) => (
                <Badge
                  key={categoria.link}
                  style={{ backgroundColor: categoria.cor }}
                  className="text-white"
                >
                  {categoria.link.replace(/\/categorias-atividades\//, "")}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Local:</span>
              {activity.unidade.map((u) => u.name).join(", ")}
            </div>
            {activity.dataProxSessao && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Próxima sessão:</span>
                {new Date(activity.dataProxSessao).toLocaleDateString("pt-BR")}
              </div>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
