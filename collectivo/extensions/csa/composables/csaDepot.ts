import { readItem, readItems } from "@directus/sdk";

export async function getCSADepots(): Promise<csaDepot[]> {
  const directus = await useDirectus();
  const depots: csaDepot[] = await directus.request(readItems("csa_depot"));
  return depots;
}

export async function getCSADepotById(id: number): Promise<csaDepot> {
  const directus = await useDirectus();
  const depot: csaDepot = await directus.request(readItem("csa_depot", id));
  return depot;
}
