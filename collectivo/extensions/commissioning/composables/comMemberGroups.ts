import { readItems, createItem } from "@directus/sdk";

export async function getMemberGroupsForCommissioning(
  commissioningId: number
): Promise<MemberGroup[]> {
  const directus = useDirectus();

  const result = await directus.request(
    readItems("com_member_group", {
      filter: {
        for_commissioning: commissioningId,
      },
    })
  );

  return result;
}
