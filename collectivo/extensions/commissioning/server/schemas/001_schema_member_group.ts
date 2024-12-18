const schema = initSchema("com_member_group", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "com_member_group",
    meta: {
      group: "collectivo_csa_commissioning",
      color: "#00ff80",
      icon: "groups_3",
    },
    schema: {},
  },
];

schema.fields = [
  ...directusSystemFields("com_member_group"),
  {
    collection: "com_member_group",
    field: "share_size",
    meta: {
      display: "related-values",
      interface: "select-dropdown-m2o",
      options: {
        template: "{{name_of_share_size}}",
      },
      special: ["m2o"],
    },
    type: "integer",
  },
  {
    collection: "com_member_group",
    field: "for_commissioning",
    meta: {
      display: "related-values",
      interface: "select-dropdown-m2o",
      options: {
        template: "{{com_related_harvest.name_of_harvest}}",
      },
      special: ["m2o"],
    },
    type: "integer",
  },
  {
    collection: "com_member_group",
    field: "amount",
    meta: {
      interface: "input",
      options: {
        min: 0,
      },
    },
    type: "integer",
  },
  {
    collection: "com_member_group",
    field: "com_distributed_partial_harvest_item",
    meta: {
      interface: "list-o2m",
      special: ["o2m"],
    },
    type: "alias",
  },
];

schema.relations = [
  {
    collection: "com_member_group",
    field: "share_size",
    related_collection: "com_share_size",
    schema: {
      on_delete: "SET NULL",
    },
  },
  {
    collection: "com_member_group",
    field: "for_commissioning",
    meta: {
      one_field: "com_member_group",
    },
    related_collection: "com_commissioning",
    schema: {
      on_delete: "SET NULL",
    },
  },
];
