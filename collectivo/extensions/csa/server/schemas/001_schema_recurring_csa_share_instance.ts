const schema = initSchema("recurringShareInstance", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "csa_recurring_share_instance",
    meta: {
      group: "collectivo_csa_extension",
      color: "#FF8962",
      icon: "shopping_basket"
    },
    schema: {},
  },
];

schema.fields = [
  ...directusSystemFields("csa_recurring_share_instance"),

  {
    collection: "csa_recurring_share_instance",
    field: "for_delivery",
    type: "integer",
    meta: {
      display: "related-values",
      interface: "select-dropdown-m2o",
      options: {
        enableCreate: false,
      },
      special: ["m2o"],
    },
  },
  {
    collection: "csa_recurring_share_instance",
    field: "for_share_of_membership",
    type: "integer",
    meta: {
      display: "related-values",
      interface: "select-dropdown-m2o",
      options: {
        enableCreate: false,
      },
      special: ["m2o"],
    },
  },
  {
    collection: "csa_recurring_share_instance",
    field: "csa_share_instance_status",
    type: "boolean",
    display: "boolean",
    display_options: {
      colorOff: "#C0C0C0",
      colorOn: "#80FF80",
      labelOff: "pausiert",
      labelOn: "aktiv",
    },
    meta: {
      interface: "boolean",
      special: ["cast-boolean"],
    },
    schema: {
      default_value: true,
    },
  },
  {
    collection: "csa_recurring_share_instance",
    field: "csa_recurring_share_instance_depot",
    meta: {
      display: "related-values",
      interface: "select-dropdown-m2o",
      options: {
        enableCreate: false,
      },
      special: ["m2o"],
    },
    schema: {
    },
    type: "integer",
  }
];

schema.relations = [
  {
    collection: "csa_recurring_share_instance",
    field: "for_delivery",
    meta: {
      one_field: "csa_recurring_share_instance",
    },
    related_collection: "csa_delivery",
    schema: {
      on_delete: "CASCADE",
    },
  },
  {
    collection: "csa_recurring_share_instance",
    field: "for_share_of_membership",
    meta: {
      one_field: "csa_recurring_share_instance",
    },
    related_collection: "csa_share_of_membership",
    schema: {
      on_delete: "CASCADE",
    },
  },
  {
    collection: "csa_recurring_share_instance",
    field: "csa_recurring_share_instance_depot",
    meta: {
      one_field: "csa_recurring_share_instance",
    },
    related_collection: "csa_depot",
    schema: {
      on_delete: "SET NULL",
    },
  }
];

schema.permissions = [
  {
    collection: "csa_recurring_share_instance",
    roleName: "collectivo_user",
    action: "create",
    // @ts-ignore
    fields: ["*"],
  },
  {
    collection: "csa_recurring_share_instance",
    roleName: "collectivo_user",
    action: "read",
    // @ts-ignore
    fields: ["*"],
  },
  {
    collection: "csa_recurring_share_instance",
    roleName: "collectivo_user",
    action: "update",
    // @ts-ignore
    fields: ["csa_share_instance_status"],
  },
];
