import { createItem, readItems, deleteItem, updateItem } from "@directus/sdk";

export async function createAlternateDepotException(
  shareOfMembershipId: number,
  date: Date,
  depotId: number
) {
  const directus = useDirectus();
  console.log("alternate Depot exception", shareOfMembershipId, date, depotId);

  const newAlternateDepotException = await directus.request(
    createItem("csa_share_of_membership_exception", {
      of_share_of_membership: shareOfMembershipId,
      date_of_share_exception: date,
      csa_type_of_share_of_membership_exception: "alternate_depot",
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
        of_share_of_membership: { _eq: shareOfMembershipId },
        date_of_share_exception: { _between: [startDate, endDate] },
      })
    );

    console.log("returning exceptions", shareOfMembershipExceptions)
    return shareOfMembershipExceptions;
  } else {
    const shareOfMembershipExceptions = await directus.request(
      readItems("csa_share_of_membership_exception", {
        of_share_of_membership: { _eq: shareOfMembershipId },
      })
    );

    return shareOfMembershipExceptions;

  }

}

export async function deleteCsaShareOfMembershipException(id: number) {
  const directus = useDirectus();
  const deletedException = await directus.request(deleteItem("csa_share_of_membership_exception", id));
  return deletedException;
}

export async function updateAlternateDepotException(
  exceptionId: number,
  depotId: number
) {
  const directus = useDirectus();
  
  const updatedException = await directus.request(
    updateItem("csa_share_of_membership_exception", exceptionId, {
      alternate_depot: depotId,
    })
  );

  return updatedException;
}

export async function createSuspendedDeliveryException(
  shareOfMembershipId: number,
  date: Date
) {
  const directus = useDirectus();

  const newSuspendedDeliveryException = await directus.request(
    createItem("csa_share_of_membership_exception", {
      of_share_of_membership: shareOfMembershipId,
      date_of_share_exception: date,
      csa_type_of_share_of_membership_exception: "suspend",
    })
  );

  return newSuspendedDeliveryException;
}
