import type { Activity } from "@/api/activities";
import { getCategoryNameFromLink } from "@/api/categories";

interface SescActivity {
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
  atividade: SescActivity[];
  total: {
    value: number;
    relation: string;
  };
}

export const fetchActivitiesFromSesc = async (): Promise<SescActivity[]> => {
  const response = await fetch(
    "https://www.sescsp.org.br/wp-json/wp/v1/atividades/filter?ppp=5000&page=1",
  );
  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }

  const jsonResponse: ApiResponse = await response.json();

  return jsonResponse.atividade;
};

export const sescActivityToActivity = (
  sescActivity: SescActivity,
): Activity => {
  const imageUrl = getActivityImageUrl(sescActivity);
  const categories = sescActivity.categorias.map((category) =>
    getCategoryNameFromLink(category.link),
  );
  const branch = sescActivity.unidade[0].name;

  return {
    id: sescActivity.id,
    title: sescActivity.titulo,
    details: sescActivity.complemento,
    imageUrl,
    link: sescActivity.link,
    nextSessionDate: sescActivity.dataProxSessao,
    firstSessionDate: sescActivity.dataPrimeiraSessao,
    lastSessionDate: sescActivity.dataUltimaSessao,
    branch,
    categories,
  };
};

const getActivityImageUrl = (activity: SescActivity): string => {
  if (
    !activity.imagens ||
    Array.isArray(activity.imagens) ||
    !activity.imagens["homepage-thumb"]
  )
    return activity.imagem;

  const basePath = activity.imagem.substring(
    0,
    activity.imagem.lastIndexOf("/") + 1,
  );

  return basePath + activity.imagens["homepage-thumb"].file;
};
