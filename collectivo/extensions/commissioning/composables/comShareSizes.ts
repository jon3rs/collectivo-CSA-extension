import { readItems, createItem } from "@directus/sdk";

export async function getShareSizeGroups(): Promise<ShareSizeGroup[]> {
  const directus = useDirectus();
  const result = await directus.request(readItems("com_share_size_group"));

  return result;
}

export async function getShareSizesOfGroup(
  groupId: number
): Promise<comShareSize[]> {
  const directus = useDirectus();

  const result = await directus.request(
    readItems("com_share_size", {
      filter: {
        of_group: groupId,
      },
    })
  );

  return result;
}
