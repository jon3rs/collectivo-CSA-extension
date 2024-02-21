declare global {

  interface CollectivoSchema {
    csa_membership: csaMembership[];
    csa_share_of_membership: csaShareOfMembership[];
    csa_recurring_share_instance: csaRecurringShareInstance[];
    csa_share_size: csaShareSize[];
    csa_share_type: csaShareType[];
    csa_depot: csaDepot[];  
    csa_delivery: csaDelivery[];
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
    csa_recurring_share_instance: number[] | null;
  }

  interface csaRecurringShareInstance {
    id: number;
    for_delivery: number;
    for_share_of_membership: number;
    csa_share_instance_status: boolean;
    csa_recurring_share_instance_depot: number;
  }

  interface csaShareSize {
    id: number;
    csa_share_size_name: string;
  }

  interface csaShareType {
    id: number;
    csa_share_type_name: string;
  }

  interface csaDepot {
    id: number;
    csa_depot_name: string;
  }

  interface csaDelivery {
    id: number;
    date_of_delivery: DateTime;
  }

//utility interfaces for frontend
interface Choice {
  value: number;
  label: string;
}

}
export {};
