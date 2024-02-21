import { createItem, createItems, readItems, readItem, updateItem } from "@directus/sdk";

export async function createRecurringShareInstances() {
  const directus = await useDirectus();

  const sharesOfMemberships = await directus.request(
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
  shareOfMembership: csaShareOfMembership,
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
        shareOfMembership,
    );

    await directus.request(
      createItem("csa_recurring_share_instance", {
        for_delivery: delivery.id,
        for_share_of_membership: shareOfMembership.id,
        csa_recurring_share_instance_depot: shareOfMembership.default_depot,
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
          csa_recurring_share_instance_depot: shareOfMembership.default_depot,
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

export async function updateCSARecurringShareInstanceStatus(
  id: number,
  status: boolean,
): Promise<csaRecurringShareInstance>{
  const directus = await useDirectus();

  const updatedShareInstance: csaRecurringShareInstance = await directus.request(
    updateItem("csa_recurring_share_instance", id, {
      csa_share_instance_status: status,
    }),
  );
  
  return updatedShareInstance;
}

export async function updateCSARecurringShareInstanceDepot(id: number,  depot: number): Promise<csaRecurringShareInstance>{
  const directus = await useDirectus();

  const updatedShareInstance: csaRecurringShareInstance = await directus.request(
    updateItem("csa_recurring_share_instance", id, {
      csa_recurring_share_instance_depot: depot,
    }),
  );
  
  return updatedShareInstance;
}