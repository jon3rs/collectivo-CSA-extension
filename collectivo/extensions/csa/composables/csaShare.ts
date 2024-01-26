import { 
    readItem,
    readItems
} from "@directus/sdk" ;

export async function getCSAShareSizes(){
    const directus = await useDirectus();
    const shareSizes: [] = await directus.request(readItems("csa_share_size"));
    return shareSizes;
}

export async function getCSAShareTypes(){
    const directus = await useDirectus();
    const shareTypes: [] = await directus.request(readItems("csa_share_type"));
    return shareTypes;
}

export async function getCSAShareTypeById(id: number){
    const directus = await useDirectus();
    const shareType = await directus.request(readItem("csa_share_type", id));
    return shareType;
}   

export async function getCSAShareSizeById(id: number){
    const directus = await useDirectus();
    const shareSize = await directus.request(readItem("csa_share_size", id));
    return shareSize;
}