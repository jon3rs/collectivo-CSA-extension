import {
    readItem, 
    readItems
} from "@directus/sdk";

export async function getCSADepots(){
    const directus = await useDirectus();
    const depots: [] = await directus.request(readItems("csa_depot"));
    return depots;
}

export async function getCSADepotById(id: number){
    const directus = await useDirectus();
    const depot = await directus.request(readItem("csa_depot", id));
    return depot;
}