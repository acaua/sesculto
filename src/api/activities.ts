const IMAGE_DEFAULT_SIZE = { width: 300, height: 150 };

export interface Activity {
  id: number;
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
  quantDatas: string;
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
  atividade: Activity[];
  total: {
    value: number;
    relation: string;
  };
}

export const fetchActivities = async (): Promise<Activity[]> => {
  const response = await fetch(
    "https://www.sescsp.org.br/wp-json/wp/v1/atividades/filter?ppp=5000&page=1",
    { credentials: "omit" },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }

  const jsonResponse: ApiResponse = await response.json();

  return jsonResponse.atividade;
};

export const getActivityImage = (
  activity: Activity,
): { url: string; width: number; height: number } => {
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
