
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
    [key: string]: string | undefined;
  }

  interface csaShareSize {
    id: number;
    csa_share_size_name: string ;
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
