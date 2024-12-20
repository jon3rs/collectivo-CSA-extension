declare global {
  interface CollectivoSchema {
    com_crop: comCrop[];
    com_unit: comUnit[];
  }

  interface comCrop {
    id: number;
    name_of_crop: string;
    default_packaging_unit?: number;
    default_unit?: number;
  }

  interface comUnit {
    id: number;
    name_of_unit: string;
  }

  interface HarvestItem {
    id: number;
    harvested_crop: number;
    items_unit?: number;
    harvested_amount?: number;
    of_harvest: number;
  }

  interface Harvest {
    id: number;
    name_of_harvest: string;
    com_harvest_item: (number | HarvestItem)[];
    harvest_notes: string;
  }

  interface comCommissioning {
    id: number;
    com_harvest: Harvest;
    com_distributed_partial_harvest_item: (
      | number
      | distributedPartialHarvestItem
    )[];
    packing_notes: string;
  }

  interface comShareSize {
    id: number;
    name_of_share_size: string;
    factor: number;
    of_group: number;
  }

  interface shareSizeGroup {
    id: number;
    group_name: string;
    com_share_sizes: number[];
  }

  interface comMemberGroup {
    id: number;
    share_size: number;
    for_commissioning: number;
    amount: number;
  }

  interface distributedPartialHarvestItem {
    id: number;
    harvest_item: number | HarvestItem; // add to fields to respective collections as well
    member_group: number | comMemberGroup; // add to fields to respective collections as well
    amount_per_member: number;
    members_amount: number;
    of_commissioning: number;
  }

  interface PackingList {
    nameOfPackingList: string;
    packingList: number | string | null[][];
  }
}

export {};
