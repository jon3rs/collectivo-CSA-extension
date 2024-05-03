const schema = initSchema("csaShareXCSADeliveryCycle", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "csa_share_type_csa_delivery_cycle",
    meta: {
      hidden: true,
      icon: "import_export",
    },
    schema: {
      name: "csa_share_type_csa_delivery_cycle",
    },
  },
];

schema.fields = [
  {
    collection: "csa_share_type_csa_delivery_cycle",
    field: "csa_share_type_id",
    meta: {
      hidden: true,
    },
    type: "integer",
  },
  {
    collection: "csa_share_type_csa_delivery_cycle",
    field: "csa_delivery_cycle_id",
    meta: {
      hidden: true,
    },
    type: "integer",
  },
];

schema.relations = [
  {
    collection: "csa_share_type_csa_delivery_cycle",
    field: "csa_delivery_cycle_id",
    meta: {
      junction_field: "csa_share_type_id",
      one_deselect_action: "delete",
      one_field: "delivered_share_types",
    },
    related_collection: "csa_delivery_cycle",
    schema: {
      on_delete: "CASCADE",
    },
  },
  {
    collection: "csa_share_type_csa_delivery_cycle",
    field: "csa_share_type_id",
    meta: {
      junction_field: "csa_delivery_cycle_id",
      one_deselect_action: "delete",
      one_field: "delivered_on",
    },
    related_collection: "csa_share_type",
    schema: {
      on_delete: "CASCADE",
    },
  },
];

schema.permissions = [
  /* {
    action: "create",
    collection: "csa_share_type_csa_delivery_cycle",
    roleName: "collectivo_user",
    fields: ["*"],
  }, */
  {
    action: "read",
    collection: "csa_share_type_csa_delivery_cycle",
    roleName: "collectivo_user",
    fields: ["*"],
  },
  {
    action: "update",
    collection: "csa_share_type_csa_delivery_cycle",
    roleName: "collectivo_user",
    fields: ["*"],
  },
  {
    action: "delete",
    collection: "csa_share_type_csa_delivery_cycle",
    roleName: "collectivo_user",
    fields: ["*"],
  }
]