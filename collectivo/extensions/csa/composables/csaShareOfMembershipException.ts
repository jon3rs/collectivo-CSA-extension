import { createItem, readItems, deleteItem, updateItem } from "@directus/sdk";

export async function createShareOfMembershipException(
  shareOfMembershipId: number,
  date: Date,
  type: string,
  depotId?: number
) {
  const directus = useDirectus();

  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

  const newAlternateDepotException = await directus.request(
    createItem("csa_share_of_membership_exception", {
      of_share_of_membership: shareOfMembershipId,
      date_of_share_exception: utcDate,
      csa_type_of_share_of_membership_exception: type,
      alternate_depot: depotId,
    })
  );

  return newAlternateDepotException;
}

export async function getShareOfMembershipExceptions(
  shareOfMembershipId: number,
  startDate?: Date,
  endDate?: Date
) {
  const directus = useDirectus();

  if (startDate && endDate) {
    const shareOfMembershipExceptions = await directus.request(
      readItems("csa_share_of_membership_exception", {
        filter: {
          _and: [
            { of_share_of_membership: { _eq: shareOfMembershipId } },
            { date_of_share_exception: { _between: [startDate, endDate] } },
          ],
        },
      })
    );

   
    return shareOfMembershipExceptions;
  } else {
    const shareOfMembershipExceptions = await directus.request(
      readItems("csa_share_of_membership_exception", {filter: {
        of_share_of_membership: { _eq: shareOfMembershipId },}
      })
    );

    return shareOfMembershipExceptions;
  }
}

export async function deleteCsaShareOfMembershipException(id: number) {
  const directus = useDirectus();

  const deletedException = await directus.request(
    deleteItem("csa_share_of_membership_exception", id)
  );

  return deletedException;
}

export async function updateShareOfMembershipException(
  exceptionId: number,
  type: string,
  depotId: number | null = null
) {
  const directus = useDirectus();

  const updatedException = await directus.request(
    updateItem("csa_share_of_membership_exception", exceptionId, {
      alternate_depot: depotId,
      csa_type_of_share_of_membership_exception: type,
    })
  );

  return updatedException;
}
