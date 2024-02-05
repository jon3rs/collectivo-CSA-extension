import { readItem, readItems } from "@directus/sdk";

export async function getCSAShareSizes(): Promise<csaShareSize[]>{
  const directus = await useDirectus();
  const shareSizes: csaShareSize[] = await directus.request(readItems("csa_share_size"));
  return shareSizes;
}

export async function getCSAShareTypes(): Promise<csaShareType[]> {
  const directus = await useDirectus();
  const shareTypes: csaShareType[] = await directus.request(readItems("csa_share_type"));
  return shareTypes;
}

export async function getCSAShareTypeById(id: number): Promise<csaShareType> {
  const directus = await useDirectus();
  const shareType: csaShareType = await directus.request(readItem("csa_share_type", id));
  return shareType;
}

export async function getCSAShareSizeById(id: number): Promise<csaShareSize>{
  const directus = await useDirectus();
  const shareSize: csaShareSize = await directus.request(readItem("csa_share_size", id));
  return shareSize;
}
