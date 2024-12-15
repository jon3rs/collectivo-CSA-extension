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
    com_harvest_item: HarvestItem[];
  }

  interface comCommissioning {
    id: number;
    com_harvest: Harvest;
  }
}

export {};
