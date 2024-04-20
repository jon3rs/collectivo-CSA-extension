const schema = initSchema("csaDepot", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "csa_depot",
    meta: {
      group: "collectivo_csa_extension",
      color: "#FF8962",
      icon: "store",
    },
    schema: {},
  },
];

schema.fields = [
  ...directusSystemFields("csa_depot"),

  {
    collection: "csa_depot",
    field: "csa_depot_name",
    meta: {
      interface: "input",
    },
    schema: {
      is_nullable: false,
    },
    type: "string",
  },
  {
    collection: "csa_depot",
    field: "csa_share_of_membership",
    meta: {
      collection: "csa_depot",
      field: "csa_share_of_membership",
      interface: "list-o2m",
      special: ["o2m"],
      options: {
        enableCreate: false,
        enableSelect: false,
        template:
          "{{of_share_size.csa_share_size_name}}{{of_share_size.of_type.csa_share_type_name}}{{of_membership.csa_membership_of.first_name}}{{of_membership.csa_membership_of.last_name}}",
      },
    },
    type: "alias",
  },
  {
    collection: "csa_depot",
    field: "exceptional_pick_ups",
    meta: {
      interface: "list-o2m",
      special: ["o2m"],
    },
    type: "alias",
  }
];

schema.permissions = [
  {
    collection: "csa_depot",
    roleName: "collectivo_user",
    action: "read",
    // @ts-ignore
    fields: ["*"],
  },
];
