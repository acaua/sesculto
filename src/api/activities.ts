export interface Activity {
  id: number;
  titulo: string;
  complemento: string;
  imagem: string;
  imagens: {
    medium_large?: { file: string };
    "atividade-img"?: { file: string };
  };
  link: string;
  quantDatas: string;
  dataProxSessao: string;
  categorias: Array<{
    titulo: string;
    cor: string;
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
  );
  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }

  const jsonResponse: ApiResponse = await response.json();

  return jsonResponse.atividade;
};
