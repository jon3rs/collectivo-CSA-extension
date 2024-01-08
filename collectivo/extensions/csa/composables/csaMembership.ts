import {
    readItems,
} from "@directus/sdk" ;



export async function getCSAmemberships(){
    const directus = await useDirectus();

    const memberships = await directus.request(readItems("csa_membership"));

    return memberships;
} 