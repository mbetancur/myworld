export type MapObject = {
  height: number;
  id: number;
  name: string;
  rotation: number;
  type: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
  point?: boolean;
};

type MapLayer = {
  name: string;
  objects: MapObject[];
  type: string;
};

type ProcessedMapData = {
  boundaries: MapObject[];
  interactiveObjs: MapObject[];
};

function processMapData(layers: MapLayer[]): ProcessedMapData {
  const processedData: ProcessedMapData = {
    boundaries: [],
    interactiveObjs: []
  };

  layers.forEach((layer) => {
    if (layer.type === "objectgroup") {
      if (layer.name === "boundaries") {
        processedData.boundaries = layer.objects;
      } else if (layer.name === "interactive-objects") {
        processedData.interactiveObjs = [...processedData.interactiveObjs, ...layer.objects];
      }
    }
  });
  return processedData;
}

export async function fetchMap(mapFilePath: string): Promise<ProcessedMapData> {
  try {
    const mapData = await (await fetch(mapFilePath)).json();
    const objectLayers = mapData.layers.filter(layer => layer.type === "objectgroup") as MapLayer[];
    return processMapData(objectLayers);
  } catch (error) {
    console.error("Error fetching map data:", error);
    throw error;
  }
}