declare global {
    interface csaMembership {
        id: number;
        csa_membership_name: string;
        csa_membership_of: uuid[]|uuid;
        csa_share_of_membership: number;
        [key: string]: string | undefined;

    },
    interface csaShareOfMembership {
        id: number;
        of_share_size: number;
        [key: string]: string | undefined;
    }
}
export {};