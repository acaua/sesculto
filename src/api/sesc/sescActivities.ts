import type { Image, Activity } from "@/api/activities";
import { getCategoryNameFromLink } from "@/api/categories";

const IMAGE_DEFAULT_SIZE = { width: 300, height: 150 };

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
  const image = getActivityImage(sescActivity);
  const categories = sescActivity.categorias.map((category) =>
    getCategoryNameFromLink(category.link),
  );
  const branch = sescActivity.unidade[0].name;

  return {
    id: sescActivity.id,
    title: sescActivity.titulo,
    details: sescActivity.complemento,
    image,
    link: sescActivity.link,
    nextSessionDate: sescActivity.dataProxSessao,
    firstSessionDate: sescActivity.dataPrimeiraSessao,
    lastSessionDate: sescActivity.dataUltimaSessao,
    categories,
    branch,
  };
};

const getActivityImage = (activity: SescActivity): Image => {
  if (
    !activity.imagens ||
    Array.isArray(activity.imagens) ||
    !activity.imagens["homepage-thumb"]
  )
    return { url: activity.imagem, ...IMAGE_DEFAULT_SIZE };

  const basePath = activity.imagem.substring(
    0,
    activity.imagem.lastIndexOf("/") + 1,
  );

  return {
    url: basePath + activity.imagens["homepage-thumb"].file,
    width: activity.imagens["homepage-thumb"].width,
    height: activity.imagens["homepage-thumb"].height,
  };
};
