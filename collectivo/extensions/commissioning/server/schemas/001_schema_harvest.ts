const schema = initSchema("com_harvest", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "com_harvest",
    meta: {
      group: "collectivo_csa_commissioning",
      color: "#00ff80",
      icon: "nest_eco_leaf",
    },
    schema: {},
  },
];

schema.fields = [
  ...directusSystemFields("com_harvest"),
  {
    collection: "com_harvest",
    field: "name_of_harvest",
    meta: {
      interface: "input",
      options: {
        placeholder: "KW ...",
      },
    },
    type: "string",
  },
  {
    collection: "com_harvest",
    field: "com_harvest_item",
    meta: {
      interface: "list-o2m",
      special: ["o2m"],
      options: {
        template:
          "{{harvested_crop.name_of_crop}} {{harvested_amount}} {{items_unit.name_of_unit}}",
      },
      display_options: {
        template:
          "{{harvested_crop.name_of_crop}} {{harvested_amount}} {{items_unit.name_of_unit}}",
      },
    },
    type: "alias",
  },
  {
    collection: "com_harvest",
    field: "harvests_commissioning",
    meta: {
      display: "related-values",
      interface: "select-dropdown-m2o",
      special: ["m2o"],
    },
    schema: {
      is_unique: true,
    },
    type: "integer",
  },
];

schema.relations = [
  {
    collection: "com_harvest",
    field: "harvests_commissioning",
    meta: {
      one_field: "com_related_harvest",
    },
    related_collection: "com_commissioning",
    schema: {
      on_delete: "SET NULL",
    },
  },
];
