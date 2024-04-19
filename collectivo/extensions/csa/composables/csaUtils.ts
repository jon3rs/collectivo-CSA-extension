import { readRelations, readFieldsByCollection, readItems } from "@directus/sdk";

export const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("de-DE", dateOptions);
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


export async function getCSARecurringShareInstances(shareOfMembership: csaShareOfMembership): Promise<csaDeliveryCycleWithDeliveries[]>{
  const csaShareSize = await getCSAShareSizeById(shareOfMembership.of_share_size);
  const csaShareType = await getCSAShareTypeById(csaShareSize.of_type);
  const directus = useDirectus();

  if(csaShareType.delivered_on){
    console.log("is delivered on");

    const deliveryCycles = await Promise.all(csaShareType.delivered_on.map(async (deliveryCycleId) => {
      const deliveryCycle = await getCsaDeliveryCycleById(deliveryCycleId);
      const deliveries = await getDeliveryCycleActualDeliveries(deliveryCycle);
      return {deliveryCycle, deliveries};
    }));
    
    console.log("csaShareType: ",csaShareType);
    return deliveryCycles;
  }
  
return []
 
}


export async function getDeliveryCycleActualDeliveries(
  deliveryCycle: csaDeliveryCycle,
  limit = 10,
  offset = 0
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

  let cancelledAndPostponedDeliveriesCopy = [...cancelledAndPostponedDeliveries];
  let addRemainingAdditionals = false;
  // todo: outsource the whole firstDateCalculation into a separate function
  let firstDeliveryDate = new Date(deliveryCycle.date_of_first_delivery);
  let nextDeliveryDate: Date;

  if (
    new Date(deliveryCycle.date_of_first_delivery).getDay() !==
    deliveryCycle.repeats_on && deliveryCycle.repeats_on
  ) {
    firstDeliveryDate.setDate(
      firstDeliveryDate.getDate() +
        ((deliveryCycle.repeats_on - firstDeliveryDate.getDay() + 7) % 7)
    );
  }

  const deliveryCycleExceptions =
    await getCSADeliveryCycleExceptionsOfDeliveryCycleByID(deliveryCycle.id);

  let currentDate = firstDeliveryDate;

  if (offset > 0) {
    currentDate = calculateAdjacentDelivery(
      firstDeliveryDate,
      offset * limit,
      deliveryCycle
    );
  }
  
  let counter = 0;
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
              exception => !actualDeliveryDates.includes(exception)
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
          if(new Date(exception.original_delivery_date) <
          new Date(lastDeliveryDate)){
            additionalDeliveries.splice(additionalDeliveries.indexOf(exception), 1);
          } else if (
            new Date(exception.original_delivery_date) <
              new Date(currentDate)
          ) {
            actualDeliveryDates.push(exception);

            
      
          }
          
        }
      );

      additionalDeliveries = additionalDeliveries.filter(
        exception => !actualDeliveryDates.includes(exception)
      );

      additionalDeliveriesCopy = additionalDeliveries;
    }

    if (deliveryCycle.date_of_last_delivery && calculateAdjacentDelivery(currentDate, 1, deliveryCycle) > new Date(deliveryCycle.date_of_last_delivery)) {
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
            exception => !actualDeliveryDates.includes(exception)
          );
        }

        
      }
    );

    cancelledAndPostponedDeliveriesCopy = cancelledAndPostponedDeliveries;

    counter++;
    actualDeliveryDates.push(objectToPush);
    
    if(addRemainingAdditionals){
      actualDeliveryDates = actualDeliveryDates.concat(additionalDeliveriesCopy);
    }

    if (deliveryCycle.repeats_on !== null) {
      nextDeliveryDate = calculateAdjacentDelivery(
        firstDeliveryDate,
        counter+(offset*limit),
        deliveryCycle
      );

      currentDate = new Date(nextDeliveryDate);
    }else{
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
