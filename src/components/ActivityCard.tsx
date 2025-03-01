import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Activity } from "@/api/activities";

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video overflow-hidden">
        {activity.imagem && (
          <img
            src={activity.imagem}
            alt={activity.titulo}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">
          {activity.titulo}
        </CardTitle>
        <div className="flex flex-wrap gap-1 mt-2">
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
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm line-clamp-3">
          {activity.complemento}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 text-sm">
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
        <a
          href={`https://www.sescsp.org.br${activity.link}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-blue-600 hover:underline"
        >
          Mais informações
        </a>
      </CardFooter>
    </Card>
  );
}
