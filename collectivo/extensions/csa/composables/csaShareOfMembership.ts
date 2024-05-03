import { createItem, readItem, readItems, updateItem } from "@directus/sdk";

export async function getCSASharesOfMembership(
  id: number,
): Promise<csaShareOfMembership[]> {
  const directus = await useDirectus();

  const shareOfMembership: csaShareOfMembership[] = await directus.request(
    readItems("csa_share_of_membership", { filter: { of_membership: { _eq: id } } }),
  );

  return shareOfMembership;
}

export async function getCSAShareOfMembershipById(
  id: number,
): Promise<csaShareOfMembership> {
  const directus = await useDirectus();

  const shareOfMembership: csaShareOfMembership = await directus.request(
    readItem("csa_share_of_membership", id),
  );

  return shareOfMembership;
}

export async function addCSAShareToMembership(
  membership: number,
  shareSize: number,
  defaultDepot: number,
) {
  const directus = await useDirectus();

  const newShare = await directus.request(
    createItem("csa_share_of_membership", {
      of_membership: membership,
      of_share_size: shareSize,
      default_depot: defaultDepot,
    }),
  );

  return newShare;
}

export async function updateDefaultDepot(membership: number, newDepot: number) {
  const directus = await useDirectus();

  const updatedShare = await directus.request(
    updateItem("csa_share_of_membership", membership, {
      default_depot: newDepot,
    }),
  );
  
  return updatedShare;
}
