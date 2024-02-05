import {createItem, readItem, readItems} from "@directus/sdk";

export async function createCSADelivery(date: Date){
    const directus = await useDirectus();
    const delivery = await directus.request(createItem("csa_delivery", {date_of_delivery: date}));
    return delivery;
}

