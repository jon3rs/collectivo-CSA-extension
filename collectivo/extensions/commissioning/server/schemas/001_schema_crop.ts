const schema = initSchema("com_crop", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "com_crop",
    meta: {
      group: "collectivo_csa_commissioning",
      color: "#00ff80",
      icon: "local_florist",
    },
    schema: {},
  },
];

schema.fields = [
  ...directusSystemFields("com_crop"),
  {
    collection: "com_crop",
    field: "name_of_crop",
    type: "string",
    meta: {
      interface: "input",
      required: true,
      display: "raw",
    },
    schema: {
      is_unique: true,
    },
  },
  {
    collection: "com_crop",
    field: "default_packaging_unit",
    type: "integer",
    meta: {
      interface: "input",
    },
  },
  {
    collection: "com_crop",
    field: "default_unit",
    type: "integer",
    meta: {
      display: "related-values",
      interface: "select-dropdown-m2o",
      options: {
        template: "{{name_of_unit}}",
      },
      display_options: {
        template: "{{name_of_unit}}",
      },
      special: ["m2o"],
    },
  },
];

schema.relations = [
  {
    collection: "com_crop",
    field: "default_unit",
    related_collection: "com_unit",
    schema: {
      on_delete: "SET NULL",
    },
  },
];
