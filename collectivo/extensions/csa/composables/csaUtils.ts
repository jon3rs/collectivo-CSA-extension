import {
  readRelations,
  readFieldsByCollection,
  readItems,
  readItem,
} from "@directus/sdk";

export const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export function formatDate(date: Date): string {

  return new Date(date).toLocaleDateString("de-DE", dateOptions);
}

export function getUTCDate(date: Date): Date {
  if(date instanceof Date){
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  }
  
  return date;
}

export function createIntervalDescription(deliveryCycle: csaDeliveryCycle) {
  let day: string = "";

  const weekday = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ];

  if (
    deliveryCycle.repeats_on != null &&
    deliveryCycle.interval_of_delivery_cycle
  ) {
    day = weekday[deliveryCycle.repeats_on];

    switch (deliveryCycle.interval_of_delivery_cycle) {
      case "weekly":
        return `jeden ${day}`;
      case "biweekly":
        return `alle zwei Wochen am ${day}`;
      case "first_of_month":
        return `jeden ersten ${day} des Monats`;
      case "second_of_month":
        return `jeden zweiten ${day} des Monats`;
      case "third_of_month":
        return `jeden dritten ${day} des Monats`;
      case "last_of_month":
        return `jeden letzten ${day} des Monats`;
    }
  }
}

export function instanceOfCsaShareOfMembershipException(object: any): object is csaShareOfMembershipException {
  return 'csa_type_of_share_of_membership_exception' in object;
}

export function instanceOfCsaDeliveryCycleException(object: any): object is csaDeliveryCycleException {
  return 'type_of_exception' in object;
}

export function getDeliveryDate(delivery: csaDeliveryCycleException |csaShareOfMembershipException | Date): Date {


  if (delivery instanceof Date) {
    return delivery;
  } else if (instanceOfCsaDeliveryCycleException(delivery)) {
    return new Date(delivery.original_delivery_date);
  } else if (instanceOfCsaShareOfMembershipException(delivery)) {
    return new Date(delivery.date_of_share_exception);
  }
}

export async function getNextDeliveries(limit: number = 3): Promise<csaShareTile[]> {
 
  const directus = useDirectus();
  const memberships: csaMembership[] = await getCSAMembershipsOfCurrentUser();

  const sharesOfMemberships: csaShareOfMembership[] = (
    await Promise.all(
      memberships.map(async (membership) => {
        return await getCSASharesOfMembership(membership.id);
      })
    )
  ).flat();


  const shareInstances = (
    await Promise.all(
      sharesOfMemberships.map(async (shareOfMembership) => {
        const deliveries: csaShareTile[] = [];
        
        await getCSARecurringShareInstances(
          shareOfMembership,
          limit, 0, new Date()
        ).then((res) => {

          res.forEach((element) => {
            element.deliveries.forEach((delivery) => {
              deliveries.push({
                delivery: delivery,
                of_share_of_membership: shareOfMembership.id,
              })
            });
          });
        });

        return deliveries;
      })
    )
  ).flat();


  shareInstances.sort(function(a, b){
    const dateA = getDeliveryDate(a.delivery);
    const dateB = getDeliveryDate(b.delivery);
    return dateA.getTime()-dateB.getTime();
  })

  return shareInstances.slice(0, limit);
}

export async function getCSARecurringShareInstances(
  shareOfMembership: csaShareOfMembership | number,
  limit = 10,
  offset = 0,
  firstDeliveryDate?: Date
): Promise<csaDeliveryCycleWithDeliveries[]> {
  if (typeof shareOfMembership === "number") {
    shareOfMembership = await getCSAShareOfMembershipById(shareOfMembership);
  }
  
  const csaShareSize = await getCSAShareSizeById(
    shareOfMembership.of_share_size
  );

  const csaShareType = await getCSAShareTypeById(csaShareSize.of_type);
  const directus = useDirectus();

  if (csaShareType.delivered_on) {
    const deliveryCycles = await Promise.all(
      csaShareType.delivered_on.map(async (junctionRowId) => {
        const junction: csaShareTypeXDeliveryCycle = await directus.request(
          readItem("csa_share_type_csa_delivery_cycle", junctionRowId)
        );

        const deliveryCycle = await getCsaDeliveryCycleById(
          junction.csa_delivery_cycle_id
        );

        const deliveries = await getDeliveryCycleActualDeliveries(
          deliveryCycle,
          limit,
          offset,
          firstDeliveryDate
            ? firstDeliveryDate
            : new Date(deliveryCycle.date_of_first_delivery)
        );

        const startDate =
          deliveries[0] instanceof Date
            ? deliveries[0]
            : deliveries[0].original_delivery_date;

        const endDate =
          deliveries[deliveries.length - 1] instanceof Date
            ? deliveries[deliveries.length - 1]
            : deliveries[deliveries.length - 1].original_delivery_date;

        const exceptions = await getShareOfMembershipExceptions(
          shareOfMembership.id,
          startDate,
          endDate
        );

        deliveries.forEach((delivery, index) => {
          const deliveryDate =
            delivery instanceof Date
              ? new Date(Date.UTC(delivery.getFullYear(), delivery.getMonth(), delivery.getDate()))
              : new Date(delivery.original_delivery_date)

          const exception = exceptions.find((exception) => {
            const exceptionDate = new Date(exception.date_of_share_exception)
            return exceptionDate.getTime() == deliveryDate.getTime();
          });
          //(exception: csaShareOfMembershipException) => new Date(exception.date_of_share_exception).getTime() === (delivery instanceof Date ? delivery.getTime() : new Date(delivery.original_delivery_date).getTime())
          //);


          if (exception && !(instanceOfCsaDeliveryCycleException(deliveries[index]) && deliveries[index].type_of_exception == "cancelled")) {
            deliveries[index] = exception;
          }
        });

        return { deliveryCycle, deliveries };
      })
    );


    return deliveryCycles;
  }

  return [];
}

export async function getDeliveryCycleActualDeliveries(
  deliveryCycle: csaDeliveryCycle,
  limit = 10,
  offset = 0,
  firstDeliveryDate: Date = new Date(deliveryCycle.date_of_first_delivery)
) {
  let additionalDeliveries: csaDeliveryCycleException[] =
    await getAdditionalDeliveryExceptionsOfDeliveryCycle(deliveryCycle.id);

  let additionalDeliveriesCopy = [...additionalDeliveries];

  const postponedDeliveries: csaDeliveryCycleException[] =
    await getPostponedDeliveryExceptionsOfDeliveryCycle(deliveryCycle.id);

  const cancelledDeliveries: csaDeliveryCycleException[] =
    await getCancelledDeliveryExceptionsOfDeliveryCycle(deliveryCycle.id);

  const cancelledAndPostponedDeliveries = [
    ...postponedDeliveries,
    ...cancelledDeliveries,
  ];

  let cancelledAndPostponedDeliveriesCopy = [
    ...cancelledAndPostponedDeliveries,
  ];
  
  let addRemainingAdditionals = false;
  // todo: outsource the whole firstDateCalculation into a separate function
  let nextDeliveryDate: Date;

  if (
    new Date(deliveryCycle.date_of_first_delivery).getDay() !==
      deliveryCycle.repeats_on &&
    deliveryCycle.repeats_on
  ) {
    firstDeliveryDate.setDate(
      firstDeliveryDate.getDate() +
        ((deliveryCycle.repeats_on - firstDeliveryDate.getDay() + 7) % 7)
    );
  }

  const deliveryCycleExceptions =
    await getCSADeliveryCycleExceptionsOfDeliveryCycleByID(deliveryCycle.id);

  let currentDate = firstDeliveryDate;
  let counter = 0;

  if(counter ==0 && calculateAdjacentDelivery(firstDeliveryDate, 0, deliveryCycle)< currentDate.setDate(currentDate.getDate() - 1)){
    currentDate = calculateAdjacentDelivery(firstDeliveryDate, 1, deliveryCycle);
    counter++;
  }else{
    currentDate = calculateAdjacentDelivery(firstDeliveryDate, 0, deliveryCycle);
  }

  if (offset > 0) {
    currentDate = calculateAdjacentDelivery(
      firstDeliveryDate,
      offset * limit,
      deliveryCycle
    );
  }

  let actualDeliveryDates: (Date | csaDeliveryCycleException)[] = [];

  while (
    counter < limit &&
    (!deliveryCycle.date_of_last_delivery ||
      currentDate <= new Date(deliveryCycle.date_of_last_delivery))
  ) {
    //check if there are any additional deliveries before the very first delivery date
    if (offset == 0 && actualDeliveryDates.length == 0) {
      additionalDeliveriesCopy.forEach(
        (exception: csaDeliveryCycleException) => {
          if (new Date(exception.original_delivery_date) < currentDate) {
            actualDeliveryDates.push(exception);

            additionalDeliveries = additionalDeliveries.filter(
              (exception) => !actualDeliveryDates.includes(exception)
            );
          }
        }
      );

      additionalDeliveriesCopy = additionalDeliveries;
      //the deliveries that would be fetched when actualDeliveryDates.length == 0 are already displayed on the site
    } else {
      const lastDeliveryDate = calculateAdjacentDelivery(
        currentDate,
        -1,
        deliveryCycle
      );

      additionalDeliveriesCopy.forEach(
        (exception: csaDeliveryCycleException) => {
          if (
            new Date(exception.original_delivery_date) <
            new Date(lastDeliveryDate)
          ) {
            additionalDeliveries.splice(
              additionalDeliveries.indexOf(exception),
              1
            );
          } else if (
            new Date(exception.original_delivery_date) < new Date(currentDate)
          ) {
            actualDeliveryDates.push(exception);
          }
        }
      );

      additionalDeliveries = additionalDeliveries.filter(
        (exception) => !actualDeliveryDates.includes(exception)
      );

      additionalDeliveriesCopy = additionalDeliveries;
    }

    if (
      deliveryCycle.date_of_last_delivery &&
      calculateAdjacentDelivery(currentDate, 1, deliveryCycle) >
        new Date(deliveryCycle.date_of_last_delivery)
    ) {
      addRemainingAdditionals = true;
    }

    let objectToPush: Date | csaDeliveryCycleException = currentDate;

    cancelledAndPostponedDeliveriesCopy.forEach(
      (exception: csaDeliveryCycleException) => {
        if (
          new Date(exception.original_delivery_date)
            .toISOString()
            .slice(0, 10) == currentDate.toISOString().slice(0, 10)
        ) {
          objectToPush = exception;

          cancelledAndPostponedDeliveries.filter(
            (exception) => !actualDeliveryDates.includes(exception)
          );
        }
      }
    );

    cancelledAndPostponedDeliveriesCopy = cancelledAndPostponedDeliveries;

    counter++;
    actualDeliveryDates.push(objectToPush);

    if (addRemainingAdditionals) {
      actualDeliveryDates = actualDeliveryDates.concat(
        additionalDeliveriesCopy
      );
    }

    if (deliveryCycle.repeats_on !== null) {
      nextDeliveryDate = calculateAdjacentDelivery(
        firstDeliveryDate,
        counter + offset * limit,
        deliveryCycle
      );

      currentDate = new Date(nextDeliveryDate);
    } else {
      // @to do: look for additionals after
      break;
    }
  }

  return actualDeliveryDates;
}

export function calculateAdjacentDelivery(
  date: Date,
  offsetAmount: number,
  deliveryCycle: csaDeliveryCycle
): Date {
  let dateToReturn: Date;

  const weekday =
    deliveryCycle.repeats_on !== null ? deliveryCycle.repeats_on : null;

  const interval = deliveryCycle.interval_of_delivery_cycle;

  if (weekday === null) {
    dateToReturn = new Date(date);
    return dateToReturn;
  }

  switch (deliveryCycle.interval_of_delivery_cycle) {
    case "weekly":
      dateToReturn = new Date(date);

      dateToReturn = new Date(
        dateToReturn.setDate(dateToReturn.getDate() + 7 * offsetAmount)
      );

      return dateToReturn;
    case "biweekly":
      dateToReturn = new Date(date);

      dateToReturn = new Date(
        dateToReturn.setDate(dateToReturn.getDate() + 14 * offsetAmount)
      );

      return dateToReturn;
    case "first_of_month":
      dateToReturn = calculateNthDeliveryOfMonth(
        date,
        weekday,
        1,
        offsetAmount
      );

      return dateToReturn;
    case "second_of_month":
      dateToReturn = calculateNthDeliveryOfMonth(
        date,
        weekday,
        2,
        offsetAmount
      );

      return dateToReturn;
    case "third_of_month":
      dateToReturn = calculateNthDeliveryOfMonth(
        date,
        weekday,
        3,
        offsetAmount
      );

      return dateToReturn;
    case "last_of_month":
      dateToReturn = calculateLastOfMonth(date, weekday, offsetAmount);
      return dateToReturn;
  }

  //return dateToReturn;
}

function calculateNthDeliveryOfMonth(
  date: Date,
  weekday: number | null,
  n: number,
  offsetAmount: number
): Date {
  const firstOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() + offsetAmount,
    1
  );

  const nthOfMonth = new Date(firstOfMonth);
  let counter = 0;

  while (nthOfMonth.getMonth() === firstOfMonth.getMonth()) {
    if (nthOfMonth.getDay() === weekday) {
      counter++;

      if (counter === n) {
        counter = 0;
        break;
      }
    }

    nthOfMonth.setDate(nthOfMonth.getDate() + 1);
  }

  return nthOfMonth;
}

function calculateLastOfMonth(
  date: Date,
  weekday: number,
  offsetAmount: number
): Date {
  const lastOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() + offsetAmount + 1,
    0
  );

  const nthOfMonth = new Date(lastOfMonth);

  //check if this returns the correct month

  while (nthOfMonth.getMonth() === lastOfMonth.getMonth()) {
    if (nthOfMonth.getDay() === weekday) {
      break;
    }

    nthOfMonth.setDate(nthOfMonth.getDate() - 1);
  }

  return nthOfMonth;
}

export async function getFieldsByCollection(collection_name: string) {
  const directus = useDirectus();

  const result = await directus.request(
    readFieldsByCollection(collection_name)
  );

  return result;
}

export async function getRelations() {
  const directus = useDirectus();

  const result = await directus.request(readRelations({ fields: ["*"] }));

  return result;
}
