const schema = initSchema("csaShareOfMembership", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "csa_share_of_membership",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      display_template:
        "{{of_share_size.csa_share_size_name}} {{of_share_size.of_type.csa_share_type_name}}",
        group: "collectivo_csa_extension",
        color: "#FF8962",
        icon: "pie_chart",
    },
  },
];

schema.fields = [
  ...directusSystemFields("csa_share_of_membership"),

  {
    collection: "csa_share_of_membership",
    field: "of_share_size",
    meta: {
      display: "related-values",
      interface: "select-dropdown-m2o",
      display_options: {
        template: "{{csa_share_size_name}}",
      },
      options: {
        enableCreate: false,
        display_template:
          "{{csa_share_size_name}} {{of_type.csa_share_type_name}}",
      },
      special: ["m2o"],
    },
    type: "integer",
  },
  {
    collection: "csa_share_of_membership",
    field: "of_membership",
    type: "integer",
    meta: {
      interface: "select-dropdown-m2o",
      display: "related-values",
      display_options: {
        template:
          "{{csa_membership_of.first_name}} {{csa_membership_of.last_name}}",
      },
      options: {
        enableCreate: false,
        display_template:
          "{{csa_membership_of.first_name}}{{csa_membership_of.last_name}}",
        template:
          "{{csa_membership_of.first_name}}{{csa_membership_of.last_name}}",
      },
      special: ["m2o"],
    },
  },
  {
    collection: "csa_share_of_membership",
    field: "default_depot",
    display: "related-values",
    display_options: {
      template: "{{csa_depot_name}}",
    },
    meta: {
      interface: "select-dropdown-m2o",
      options: {
        enableCreate: false,
        template: "{{csa_depot_name}}",
      },
      special: ["m2o"],
    },
    schema: {},
    type: "integer",
  },
  {
    collection: "csa_membership",
    field: "csa_share_of_membership",
    meta: {
      interface: "list-o2m",
      special: ["o2m"],
    },
    type: "alias",
  },
];

schema.relations = [
  {
    collection: "csa_share_of_membership",
    field: "of_share_size",
    meta: {
      one_field: "csa_share_of_membership",
    },
    related_collection: "csa_share_size",
    schema: {
      on_delete: "SET NULL",
    },
  },
  {
    collection: "csa_share_of_membership",
    field: "of_membership",
    meta: {
      one_field: "csa_share_of_membership",
    },
    related_collection: "csa_membership",
    schema: {
      on_delete: "CASCADE",
    },
  },
  {
    collection: "csa_share_of_membership",
    field: "default_depot",
    meta: {
      one_field: "csa_share_of_membership",
    },
    related_collection: "csa_depot",
    schema: {
      on_delete: "SET NULL",
    },
  },
];

schema.permissions = [
  {
    collection: "csa_share_of_membership",
    roleName: "collectivo_user",
    action: "create",
    // @ts-ignore
    fields: ["*"],
  },
  {
    collection: "csa_share_of_membership",
    roleName: "collectivo_user",
    action: "read",
    // @ts-ignore
    fields: ["*"],
  },
  {
    collection: "csa_share_of_membership",
    roleName: "collectivo_user",
    action: "update",
    // @ts-ignore
    fields: ["*"],
  },
];

schema.flows = [];
