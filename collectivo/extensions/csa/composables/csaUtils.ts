import { readRelations, readFieldsByCollection } from "@directus/sdk";

export const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("de-DE", dateOptions);
}

/* export function calculateDeliveriesAmount(deliveryCycle: csaDeliveryCycle) {
    const deliveriesPerCycle =
      (new Date(deliveryCycle.date_of_last_delivery) -
        new Date(deliveryCycle.date_of_first_delivery)) /
        1000 /
        60 /
        60 /
        24 /
        deliveryCycle.interval_of_delivery_cycle +
      1;
  
    const deliveriesPerCycleRounded = Math.floor(deliveriesPerCycle);
    return deliveriesPerCycleRounded;
} */

export async function getDeliveryCycleActualDeliveries(
  deliveryCycle: csaDeliveryCycle,
  limit = 10,
  offset = 0
) {
  const additionalDeliveries: csaDeliveryCycleException[] =
    await getAdditionalDeliveryExceptionsOfDeliveryCycle(deliveryCycle.id);

  const additionalDeliveriesCopy = [...additionalDeliveries];

  const postponedDeliveries: csaDeliveryCycleException[] =
    await getPostponedDeliveryExceptionsOfDeliveryCycle(deliveryCycle.id);

  const cancelledDeliveries: csaDeliveryCycleException[] =
    await getCancelledDeliveryExceptionsOfDeliveryCycle(deliveryCycle.id);

  const cancelledAndPostponedDeliveries = [
    ...postponedDeliveries,
    ...cancelledDeliveries,
  ];

  // todo: outsource the whole firstDateCalculation into a separate function
  let firstDeliveryDate = new Date(deliveryCycle.date_of_first_delivery);
  let nextDeliveryDate: Date;

  if (
    new Date(deliveryCycle.date_of_first_delivery).getDay() !==
    deliveryCycle.repeats_on
  ) {
    firstDeliveryDate.setDate(
      firstDeliveryDate.getDate() +
        ((deliveryCycle.repeats_on - firstDeliveryDate.getDay() + 7) % 7)
    );
  }

  if (offset > 0) {
    let scheduledFirstDelivery = calculateAdjacentDelivery(
      firstDeliveryDate,
      offset * limit, 
      deliveryCycle
    );

    console.log("scheduledFirstDelivery for: ", offset*limit, "first", scheduledFirstDelivery);
    let deliveriesToSubtract = 0;
    const pastDeliveries: csaDeliveryCycleException[] = [];
    const remainingAdditionalDeliveries: csaDeliveryCycleException[] = [];

    additionalDeliveries.forEach((exception: csaDeliveryCycleException) => {
      if (new Date(exception.original_delivery_date) < scheduledFirstDelivery) {
        pastDeliveries.push(exception);
        deliveriesToSubtract++;
      }
    });

    pastDeliveries.forEach((exception: csaDeliveryCycleException) => {
      
    });
    /* for(let i = (pastDeliveries.length-1); i >= 0; i--){
      console.log("dates between ", calculateAdjacentDelivery(scheduledFirstDelivery, -1, deliveryCycle).toDateString(), " and ", scheduledFirstDelivery.toDateString());

      if(pastDeliveries[i].original_delivery_date < calculateAdjacentDelivery(scheduledFirstDelivery, -1, deliveryCycle)){
        break;
      }else{
        remainingAdditionalDeliveries.push(pastDeliveries[i])
      }
    } */

    console.log("pastDeliveries: ", pastDeliveries);
    console.log("remainingAdditionalDeliveries: ", remainingAdditionalDeliveries);

    firstDeliveryDate = new Date(
      calculateAdjacentDelivery(
        firstDeliveryDate,
        offset * limit - deliveriesToSubtract,// - remainingAdditionalDeliveries.length, //+ deliveriesNotYetDisplayed / dragged along? /remaining additionals
        deliveryCycle
      )
    );
  }

  const deliveryCycleExceptions =
    await getCSADeliveryCycleExceptionsOfDeliveryCycleByID(deliveryCycle.id);

  let currentDate = firstDeliveryDate;
  //date has to react to offset
  let counter = 0;
  const actualDeliveryDates: (Date | csaDeliveryCycleException)[] = [];

  while (
    actualDeliveryDates.length < limit &&
    (!deliveryCycle.date_of_last_delivery ||
      currentDate <= new Date(deliveryCycle.date_of_last_delivery))
  ) {
    //calculate additional offset when offset > 0 somewhere here (how many additional deliveries have there been before -> subtract those from firstDeliveryDate)
    //check if there are any additional deliveries before the very first delivery date
    if (offset == 0 && actualDeliveryDates.length == 0) {
      additionalDeliveriesCopy.forEach((exception: csaDeliveryCycleException) => {
        if (new Date(exception.original_delivery_date) < currentDate) {
          if(actualDeliveryDates.length < limit){
            actualDeliveryDates.push(exception);

            additionalDeliveries.splice(
              additionalDeliveries.indexOf(exception),
              1
            );
          }
          
        }
      });
      //the deliveries that would be fetched when actualDeliveryDates.length == 0 are already displayed on the site
    } else if ( actualDeliveryDates.length > 0){
      const lastDeliveryDate = calculateAdjacentDelivery(
        currentDate,
        -1,
        deliveryCycle
      );
      //console.log("vorherige Lieferung", lastDeliveryDate, currentDate)
      //auch hier könnte limit gesprengt werden

      additionalDeliveriesCopy.forEach((exception: csaDeliveryCycleException) => {
        if (
          new Date(exception.original_delivery_date) < new Date(currentDate) &&
          new Date(exception.original_delivery_date) >
            new Date(lastDeliveryDate)
        ) {
          if(actualDeliveryDates.length < limit){
            actualDeliveryDates.push(exception);
  
            additionalDeliveries.splice(
              additionalDeliveries.indexOf(exception),
              1
            );
  
          }
          
        }
      });
    }

    if (actualDeliveryDates.length < limit) {
      let objectToPush: Date | csaDeliveryCycleException = currentDate;

      cancelledAndPostponedDeliveries.forEach(
        (exception: csaDeliveryCycleException) => {
          if (
            new Date(exception.original_delivery_date)
              .toISOString()
              .slice(0, 10) == currentDate.toISOString().slice(0, 10)
          ) {
            objectToPush = exception;

            cancelledAndPostponedDeliveries.splice(
              cancelledAndPostponedDeliveries.indexOf(exception),
              1
            );
          }
        }
      );

      if (objectToPush instanceof Date) {
        objectToPush = calculateAdjacentDelivery(currentDate, 0, deliveryCycle);
      }

      counter++;
      actualDeliveryDates.push(objectToPush);
    } else {
      break;
    }

    if (deliveryCycle.repeats_on !== null) {
      nextDeliveryDate = calculateAdjacentDelivery(
        firstDeliveryDate,
        counter,
        deliveryCycle
      );

      currentDate = new Date(nextDeliveryDate);
    }
  }

  return actualDeliveryDates;
}

function calculateAdjacentDelivery(
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
