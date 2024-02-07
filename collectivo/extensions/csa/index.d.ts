declare global {
  interface csaMembership {
    id: number;
    csa_membership_of: uuid[] | uuid;
    csa_share_of_membership: number[];
    [key: string]: string | undefined;
  }
  interface csaShareOfMembership {
    id: number;
    of_share_size: number;
    default_depot: number;
    of_membership: number;
    csa_recurring_share_instance: number[] | null;
    [key: string]: string | undefined;
  }

  interface csaRecurringShareInstance {
    id: number;
    for_delivery: number;
    for_share_of_membership: number;
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
}
export {};
