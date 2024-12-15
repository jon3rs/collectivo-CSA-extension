import { readItems } from "@directus/sdk";

export async function getUnits(): Promise<comUnit[]> {
  const directus = useDirectus();
  const result = await directus.request(readItems("com_unit"));

  return result;
}
