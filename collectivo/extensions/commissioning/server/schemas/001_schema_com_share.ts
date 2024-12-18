const schema = initSchema("com_share_size", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "com_share_size",
    meta: {
      group: "collectivo_csa_commissioning",
      color: "#00ff80",
      icon: "arrow_range",
    },
    schema: {},
  },
];

schema.fields = [
  ...directusSystemFields("com_share_size"),
  {
    collection: "com_share_size",
    field: "name_of_share_size",
    meta: {
      interface: "input",
      required: true,
    },
    type: "string",
  },
  {
    collection: "com_share_size",
    field: "factor",
    meta: {
      interface: "input",
      options: {
        min: 0,
      },
      required: true,
    },
    type: "float",
  },
  {
    collection: "com_share_size",
    field: "of_group",
    meta: {
      display: "related-values",
      interface: "select-dropdown-m2o",
      special: ["m2o"],
    },
    type: "integer",
  },
];

schema.relations = [
  {
    collection: "com_share_size",
    field: "of_group",
    meta: {
      one_field: "com_share_sizes",
    },
    related_collection: "com_share_size_group",
    schema: {
      on_delete: "SET NULL",
    },
  },
];
