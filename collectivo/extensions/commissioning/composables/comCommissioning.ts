import { readItems, createItem, updateItem, readItem } from "@directus/sdk";

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

export async function getPackingNotes(
  commissioningId: number
): Promise<string> {
  const directus = useDirectus();

  const result = await directus.request(
    readItem("com_commissioning", commissioningId)
  );

  return result.packing_notes as string;
}

export async function savePackingNotes(commissioningId: number, notes: string) {
  const directus = useDirectus();

  const result = await directus.request(
    updateItem("com_commissioning", commissioningId, {
      packing_notes: notes,
    })
  );

  return result;
}
