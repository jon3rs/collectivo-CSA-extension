import { 
    readMe,
    readUser,
} from "@directus/sdk" ;

export async function getCurrentUser() {
    const directus = await useDirectus();
    const user = await directus.request(readMe({ fields: ["*"]}));
    return user.id;
}

export async function getUserByID(id: string){
    const directus = await useDirectus();
    const user = await directus.request(readUser(id, { fields: ["*"]}))
    return user;
}