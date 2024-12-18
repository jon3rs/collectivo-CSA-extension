import { readItem, readItems, createItem, updateItem } from "@directus/sdk";

export async function createHarvestItem(
  harvestItem: HarvestItem
): Promise<HarvestItem> {
  const directus = useDirectus();

  const result = await directus.request(
    createItem("com_harvest_item", harvestItem)
  );

  return result as HarvestItem;
}

export async function updateHarvest(harvest: Harvest): Promise<Harvest> {
  const directus = useDirectus();

  const result = await directus.request(
    updateItem("com_harvest", harvest.id, harvest)
  );

  return result as Harvest;
}

export async function createHarvest(
  harvestName: string,
  harvestItems?: HarvestItem[]
): Promise<Harvest> {
  const directus = useDirectus();

  const harvest = await directus.request(
    createItem("com_harvest", {
      name_of_harvest: harvestName,
    })
  );

  if (!harvestItems) {
    return harvest as Harvest;
  }

  await Promise.all(
    harvestItems.map(async (harvestItem) => {
      try {
        await createHarvestItem({
          harvested_crop: harvestItem.harvested_crop,
          items_unit: harvestItem.items_unit,
          harvested_amount: harvestItem.harvested_amount,
          of_harvest: harvest.id,
        });
      } catch (error) {
        console.info(error);
      }
    })
  );

  return harvest as Harvest;
}

export async function getHarvests(): Promise<Harvest[]> {
  const directus = useDirectus();

  const result = await directus.request(
    readItems("com_harvest", {
      limit: 10,
      sort: "-date_created",
    })
  );

  return result as Harvest[];
}

export async function getHarvestItem(
  harvestItemID: number
): Promise<HarvestItem> {
  const directus = useDirectus();

  const result = await directus.request(
    readItem("com_harvest_item", harvestItemID)
  );

  return result as HarvestItem;
}

export async function getPartialDistributedHarvestItemsOfCommissioning(
  commissioningId: number
): Promise<distributedPartialHarvestItem[]> {
  const directus = useDirectus();

  const result = await directus.request(
    readItems("com_distributed_partial_harvest_item", {
      filter: {
        of_commissioning: commissioningId,
      },
    })
  );

  return result as distributedPartialHarvestItem[];
}

export async function createPartialDistributedHarvestItem(
  distributedPartialHarvestItem: distributedPartialHarvestItem
): Promise<distributedPartialHarvestItem> {
  const directus = useDirectus();

  const result = await directus.request(
    createItem(
      "com_distributed_partial_harvest_item",
      distributedPartialHarvestItem
    )
  );

  return result as distributedPartialHarvestItem;
}

export async function updatePartialDistributedHarvestItem(
  distributedPartialHarvestItem: distributedPartialHarvestItem
): Promise<distributedPartialHarvestItem> {
  const directus = useDirectus();

  const result = await directus.request(
    updateItem(
      "com_distributed_partial_harvest_item",
      distributedPartialHarvestItem.id,
      distributedPartialHarvestItem
    )
  );

  return result as distributedPartialHarvestItem;
}

export async function getHarvestOfCommissioning(
  commissioningId: number
): Promise<Harvest | null> {
  const directus = useDirectus();

  const result = await directus.request(
    readItems("com_harvest", {
      filter: {
        harvests_commissioning: commissioningId,
      },
    })
  );

  if (result.length === 0) {
    return null;
  } else if (result.length > 1) {
    throw new Error("More than one harvest found for this commissioning");
  }

  return result[0] as Harvest;
}
