import {readItem, readItems} from "@directus/sdk";

export async function getCSADeliveryCycles(): Promise<csaDeliveryCycle[]> {
  const directus = await useDirectus();

  const deliveryCycles: csaDeliveryCycle[] = await directus.request(
    readItems("csa_delivery_cycle"),
  );

  return deliveryCycles;
}

export async function getCSADeliveryCycleExceptionsOfDeliveryCycleByID(id: number): Promise<csaDeliveryCycleException[]> {
  const directus = await useDirectus();

  const deliveryCycleExceptions: csaDeliveryCycleException[] = await directus.request(
    readItems("csa_delivery_cycle_exception", {
      filter: {
        of_delivery_cycle: {
          _eq: id,
        },
      },
      sort: ["original_delivery_date"],
    }),
  );

  return deliveryCycleExceptions;
}

export async function getAdditionalDeliveryExceptionsOfDeliveryCycle(deliveryCycleID: number): Promise<csaDeliveryCycleException[]> {
  const directus = await useDirectus();
  console.log("hi from exception catching");

  const deliveryCycleExceptions: csaDeliveryCycleException[] = await directus.request(
    readItems("csa_delivery_cycle_exception", {
      filter: {
        of_delivery_cycle: {
          _eq: deliveryCycleID,
        },
        type_of_exception: {
          _eq: "additional",
        },
      },
      sort: ["original_delivery_date"],
    }),
  );

  return deliveryCycleExceptions;
}

export async function getPostponedDeliveryExceptionsOfDeliveryCycle(deliveryCycleID: number): Promise<csaDeliveryCycleException[]> {
  const directus = await useDirectus();

  const deliveryCycleExceptions: csaDeliveryCycleException[] = await directus.request(
    readItems("csa_delivery_cycle_exception", {
      filter: {
        of_delivery_cycle: {
          _eq: deliveryCycleID,
        },
        type_of_exception: {
          _eq: "postponed",
        },
      },
      sort: ["original_delivery_date"],
    }),
  );

  return deliveryCycleExceptions;
}

export async function getCancelledDeliveryExceptionsOfDeliveryCycle(deliveryCycleID: number): Promise<csaDeliveryCycleException[]> {
  const directus = await useDirectus();

  const deliveryCycleExceptions: csaDeliveryCycleException[] = await directus.request(
    readItems("csa_delivery_cycle_exception", {
      filter: {
        of_delivery_cycle: {
          _eq: deliveryCycleID,
        },
        type_of_exception: {
          _eq: "cancelled",
        },
      },
      sort: ["original_delivery_date"],
    }),
  );

  return deliveryCycleExceptions;
}