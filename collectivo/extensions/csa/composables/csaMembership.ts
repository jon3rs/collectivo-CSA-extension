import {
    readItems,
} from "@directus/sdk" ;



export async function getCSAMemberships(){
    const directus = await useDirectus();
    console.log(directus);
    const memberships = await directus.request(readItems("csa_membership"));

    return memberships;
} 