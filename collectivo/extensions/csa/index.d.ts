declare global {

  interface CollectivoSchema {
    csa_membership: csaMembership[];
    csa_share_of_membership: csaShareOfMembership[];
    csa_share_size: csaShareSize[];
    csa_share_type: csaShareType[];
    csa_depot: csaDepot[];  
    csa_delivery: csaDelivery[];
    csa_delivery_cycle: csaDeliveryCycle[];
    csa_delivery_cycle_exception: csaDeliveryCycleException[];
    csa_delivery_cycle_with_deliveries: csaDeliveryCycleWithDeliveries[];
  }
  interface csaMembership {
    id: number;
    csa_membership_of: uuid[] | uuid;
    csa_share_of_membership: number[];
  }
  interface csaShareOfMembership {
    id: number;
    of_share_size: number;
    default_depot: number;
    of_membership: number;
  }

  interface csaShareSize {
    id: number;
    csa_share_size_name: string;
    of_type: number;
  }

  interface csaShareType {
    id: number;
    csa_share_type_name: string;
    delivered_on?: number[];
  }

  interface csaDepot {
    id: number;
    csa_depot_name: string;
  }

  interface csaDelivery {
    id: number;
    date_of_delivery: Date;
  }

  interface csaDeliveryCycle {
    id: number;
    name_of_delivery_cycle: string | null;
    type_of_delivery_cycle: string;
    date_of_first_delivery: Date;
    repeats_on?: number | null;
    interval_of_delivery_cycle?: string | null;
    date_of_last_delivery?: Date | null;
    delivered_share_types?: number[];
  }
  interface csaDeliveryCycleException {
    id: number;
    of_delivery_cycle: number;
    type_of_exception: string;
    original_delivery_date: Date;
    new_delivery_date?: Date | null;
  }

//utility interfaces for frontend

interface csaDeliveryCycleWithDeliveries {
  deliveryCycle: csaDeliveryCycle;
  deliveries: (Date | csaDeliveryCycleException)[];
}
interface Choice {
  value: number;
  label: string;
}

}
export {};
