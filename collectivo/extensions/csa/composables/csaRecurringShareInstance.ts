import { createItem, createItems, readItems, readItem } from "@directus/sdk";

export async function createRecurringShareInstances() {
  const directus = await useDirectus();

  const sharesOfMemberships: csaShareOfMembership[] = await directus.request(
    readItems("csa_share_of_membership"),
  );

  const deliveries: csaDelivery[] = await directus.request(
    readItems("csa_delivery"),
  );

  deliveries.forEach((delivery) => {
    sharesOfMemberships.forEach(async (shareOfMembership) => {
      await directus.request(
        createItem("csa_recurring_share_instance", {
          for_delivery: delivery.id,
          for_share_of_membership: shareOfMembership.id,
        }),
      );
    });
  });
}

export async function createRecurringShareInstancesFor(
  shareOfMemberShipId: number,
) {
  const directus = await useDirectus();

  const deliveries: csaDelivery[] = await directus.request(
    readItems("csa_delivery"),
  );

  deliveries.forEach(async (delivery) => {
    console.log(
      "creating share instance for delivery: " +
        delivery.id +
        " and shareOfMembership: " +
        shareOfMemberShipId,
    );

    await directus.request(
      createItem("csa_recurring_share_instance", {
        for_delivery: delivery.id,
        for_share_of_membership: shareOfMemberShipId,
      }),
    );
  });
}

export async function createRecurringShareInstancesForDeliveries(
  deliveryIds: number[],
) {
  const directus = await useDirectus();

  const sharesOfMemberships: csaShareOfMembership[] = await directus.request(
    readItems("csa_share_of_membership"),
  );

  deliveryIds.forEach(async (deliveryId) => {
    sharesOfMemberships.forEach(async (shareOfMembership) => {
      await directus.request(
        createItem("csa_recurring_share_instance", {
          for_delivery: deliveryId,
          for_share_of_membership: shareOfMembership.id,
        }),
      );
    });
  });
}

export async function getCSARecurringShareInstanceById(
  id: number,
): Promise<csaRecurringShareInstance> {
  const directus = await useDirectus();

  const shareInstance: csaRecurringShareInstance = await directus.request(
    readItem("csa_recurring_share_instance", id),
  );

  return shareInstance;
}
