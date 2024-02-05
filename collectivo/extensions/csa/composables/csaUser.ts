import { readMe, readUser } from "@directus/sdk";
import type { DirectusUser } from "@directus/sdk";


export async function getCurrentUser(): Promise<string>{
  const directus = await useDirectus();
  const user:  DirectusUser = await directus.request(readMe({ fields: ["*"] }));
  return user.id;
}

export async function getUserByID(id: string): Promise<DirectusUser> {
  const directus = await useDirectus();
  const user: DirectusUser = await directus.request(readUser(id, { fields: ["*"] }));
  return user;
}
