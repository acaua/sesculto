import type { Event } from "@/api/events";
import { getCategoryNameFromLink } from "@/api/categories";

interface SescEvent {
  id: number;
  id_java: string;
  titulo: string;
  complemento: string;
  imagem: string;
  imagens?:
    | {
        "homepage-thumb"?: { file: string; width: number; height: number };
      }
    // Something is wrong with the API and there are records where imagens is incorrectly an empty array
    | [];
  link: string;
  dataProxSessao: string;
  dataPrimeiraSessao: string;
  dataUltimaSessao: string;
  categorias: Array<{
    cor: string;
    link: string;
    titulo: string;
  }>;
  unidade: Array<{
    name: string;
    link: string;
  }>;
}

interface ApiResponse {
  atividade: SescEvent[];
  total: {
    value: number;
    relation: string;
  };
}

export const fetchEventsFromSesc = async (): Promise<SescEvent[]> => {
  const response = await fetch(
    "https://www.sescsp.org.br/wp-json/wp/v1/atividades/filter?ppp=5000&page=1",
  );
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const jsonResponse: ApiResponse = await response.json();

  return jsonResponse.atividade;
};

export const sescEventToEvent = (sescEvent: SescEvent): Event => {
  const imageUrl = getEventImageUrl(sescEvent);
  const categories = sescEvent.categorias.map((category) =>
    getCategoryNameFromLink(category.link),
  );
  const branch = sescEvent.unidade[0].name;

  return {
    id: sescEvent.id,
    title: sescEvent.titulo,
    details: sescEvent.complemento,
    imageUrl,
    link: sescEvent.link,
    nextSessionDate: sescEvent.dataProxSessao,
    firstSessionDate: sescEvent.dataPrimeiraSessao,
    lastSessionDate: sescEvent.dataUltimaSessao,
    branch,
    categories,
  };
};

const getEventImageUrl = (event: SescEvent): string => {
  if (
    !event.imagens ||
    Array.isArray(event.imagens) ||
    !event.imagens["homepage-thumb"]
  )
    return event.imagem;

  const basePath = event.imagem.substring(0, event.imagem.lastIndexOf("/") + 1);

  return basePath + event.imagens["homepage-thumb"].file;
};
