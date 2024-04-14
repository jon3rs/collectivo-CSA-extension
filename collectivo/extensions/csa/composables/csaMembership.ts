import {
  readMe,
  readItems,
  createItem,
  updateItem,
  deleteItem,
  readFieldsByCollection,
  readCollection,
} from "@directus/sdk";

export async function getCSAMemberships(){
  const directus = await useDirectus();

  const csaMemberships = await directus.request(
    readItems("csa_membership"),
  );

  return csaMemberships;
}

export async function getCSAMembershipsOfCurrentUser(): Promise<
  csaMembership[]
> {
  const directus = await useDirectus();
  const user = await directus.request(readMe({ fields: ["*"] }));

  const memberships: csaMembership[] = await directus.request(
    readItems("csa_membership", { filter: { csa_membership_of: {_eq: user.id} } }),
  );

  return memberships;
}

export async function addNewMembership(id: string) {
  const directus = await useDirectus();

  const newMembership = await directus.request(
    createItem("csa_membership", { csa_membership_of: id }),
  );

  return newMembership;
}

/* export async function updateMembershipName(id: number){
    const directus = await useDirectus();
    const updatedMembership = await directus.request(updateItem("csa_membership", id , ));
    return updatedMembership;
} */

export async function deleteCSAMembership(id: number) {
  const directus = await useDirectus();

  const deletedMembership = await directus.request(
    deleteItem("csa_membership", id),
  );

  return deletedMembership;
}

export async function getCollection(collection_name: string) {
  const directus = useDirectus();
  const user = await directus.request(readMe({ fields: ["id"] }));
  console.log(user);
  const result = await directus.request(readCollection(collection_name));
  return result;
}
