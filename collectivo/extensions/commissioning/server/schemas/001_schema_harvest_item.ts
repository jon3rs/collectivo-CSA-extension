const schema = initSchema("com_harvest_item", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "com_harvest_item",
    meta: {
      group: "collectivo_csa_commissioning",
      color: "#00ff80",
      icon: "local_florist",
    },
    schema: {},
  },
];

schema.fields = [
  ...directusSystemFields("com_harvest_item"),
  {
    collection: "com_harvest_item",
    field: "harvested_crop",
    meta: {
      display: "related-values",
      interface: "select-dropdown-m2o",
      options: {
        template: "{{name_of_crop}}",
      },
      display_options: {
        template: "{{name_of_crop}}",
      },
      required: true,
      special: ["m2o"],
    },
    schema: {
      is_nullable: false,
    },
    type: "integer",
  },
  {
    collection: "com_harvest_item",
    field: "items_unit",
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
    type: "integer",
  },
  {
    collection: "com_harvest_item",
    field: "harvested_amount",
    meta: {
      interface: "input",
      options: {
        min: 0,
      },
    },
    type: "float",
  },
  {
    collection: "com_harvest_item",
    field: "of_harvest",
    meta: {
      display: "related-values",
      required: true,
      special: ["m2o"],
    },
    schema: {
      is_nullable: false,
    },
    type: "integer",
  },
];

schema.relations = [
  {
    collection: "com_harvest_item",
    field: "harvested_crop",
    related_collection: "com_crop",
    schema: {
      on_delete: "NO ACTION",
    },
  },
  {
    collection: "com_harvest_item",
    field: "items_unit",
    related_collection: "com_unit",
    schema: {
      on_delete: "SET NULL", //or no action?
    },
  },
  {
    collection: "com_harvest_item",
    field: "of_harvest",
    meta: {
      one_field: "com_harvest_item",
    },
    related_collection: "com_harvest",
    schema: {
      on_delete: "CASCADE",
    },
  },
];
