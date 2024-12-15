import { readItems, createItem } from "@directus/sdk";

export async function getCrops(): Promise<comCrop[]> {
  const directus = useDirectus();
  const result = await directus.request(readItems("com_crop"));

  return result;
}

export async function addCrop(crop: comCrop): Promise<comCrop> {
  const directus = useDirectus();
  const result = await directus.request(createItem("com_crop", crop));

  return result;
}
