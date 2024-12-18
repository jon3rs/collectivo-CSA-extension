const schema = initSchema("com_distributed_partial_harvest_item", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "com_distributed_partial_harvest_item",
    meta: {
      group: "collectivo_csa_commissioning",
      color: "#00ff80",
      icon: "pie_chart",
    },
    schema: {},
  },
];

schema.fields = [
  {
    collection: "com_distributed_partial_harvest_item",
    field: "harvest_item",
    meta: {
      display: "related-values",
      interface: "select-dropdown-m2o",
      options: {
        enableCreate: false,
        template:
          "{{harvested_crop.name_of_crop}}{{harvested_amount}}{{items_unit.name_of_unit}}",
      },
      special: ["m2o"],
    },
    type: "integer",
  },
  {
    collection: "com_distributed_partial_harvest_item",
    field: "member_group",
    meta: {
      display: "related-values",
      interface: "select-dropdown-m2o",
      options: {
        enableCreate: false,
        template: "{{share_size.name_of_share_size}}{{amount}}",
      },
      special: ["m2o"],
    },
    type: "integer",
  },
  {
    collection: "com_distributed_partial_harvest_item",
    field: "amount_per_member",
    meta: {
      interface: "input",
      options: {
        min: 0,
      },
    },
    type: "float",
  },
  {
    collection: "com_distributed_partial_harvest_item",
    field: "members_amount",
    meta: {
      interface: "input",
      options: {
        min: 0,
      },
    },
    type: "integer",
  },
  {
    collection: "com_distributed_partial_harvest_item",
    field: "of_commissioning",
    meta: {
      display: "related-values",
      interface: "select-dropdown-m2o",
      options: {
        enableCreate: false,
        template: "{{com_related_harvest.name_of_harvest}}",
      },
      special: ["m2o"],
    },
    type: "integer",
  },
];

schema.relations = [
  {
    collection: "com_distributed_partial_harvest_item",
    field: "harvest_item",
    meta: {
      one_field: "distributed_partial_harvest_item",
    },
    related_collection: "com_harvest_item",
    schema: {
      on_delete: "CASCADE",
    },
  },
  {
    collection: "com_distributed_partial_harvest_item",
    field: "member_group",
    meta: {
      one_field: "com_distributed_partial_harvest_item",
    },
    related_collection: "com_member_group",
    schema: {
      on_delete: "CASCADE",
    },
  },
  {
    collection: "com_distributed_partial_harvest_item",
    field: "of_commissioning",
    meta: {
      one_field: "com_distributed_partial_harvest_item",
    },
    related_collection: "com_commissioning",
    schema: {
      on_delete: "CASCADE",
    },
  },
];
