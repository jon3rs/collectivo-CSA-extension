import { readItems, createItem, updateItem } from "@directus/sdk";

export async function createCommissioning(
  harvestId: object
): Promise<comCommissioning> {
  const directus = useDirectus();
  console.log("inside createCommissioning with id", harvestId);

  const result = await directus.request(createItem("com_commissioning", {}));

  const updatedHarvest = await directus.request(
    updateItem("com_harvest", harvestId, {
      harvests_commissioning: result.id,
    })
  );

  console.log("result: ", result, updatedHarvest);

  return result;
}
