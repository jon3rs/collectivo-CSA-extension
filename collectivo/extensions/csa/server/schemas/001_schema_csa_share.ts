const schema = initSchema("csaShare", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "csa_share_type",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      display_template: "{{csa_share_type_name}}",
      group: "collectivo_csa_extension",
      color: "#FF8962",
      icon: "nutrition",
    },
  },
  {
    collection: "csa_share_size",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      display_template: "{{csa_share_size_name}}",
      group: "collectivo_csa_extension",
      color: "#FF8962",
      icon: "arrow_range"
    },
  },
];

schema.fields = [
  ...directusSystemFields("csa_share_type"),
  ...directusSystemFields("csa_share_size"),
  {
    collection: "csa_share_type",
    field: "csa_share_type_name",
    type: "string",
    schema: {},
    meta: {
      interface: "input",
    },
  },

  {
    collection: "csa_share_size",
    field: "csa_share_size_name",
    type: "string",
    schema: {},
    meta: {
      interface: "input",
    },
  },
  {
    collection: "csa_share_size",
    field: "of_type",
    type: "integer",
    related_collection: "share_type",
    schema: {
      on_delete: "CASCADE",
    },
    meta: {
      display: "related-values",
      interface: "select-dropdown-m2o",
      special: ["m2o"],
      display_options: {
        template: "{{csa_share_type_name}}",
      },
    },
  },
  {
    collection: "csa_share_type",
    field: "csa_share_size",
    type: "alias",
    meta: {
      special: ["o2m"],
      interface: "list-o2m",
    },
  },
  {
    collection: "csa_share_size",
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
    collection: "csa_share_size",
    field: "of_type",
    meta: {
      one_field: "csa_share_size",
      sort_field: null,
    },
    related_collection: "csa_share_type",
    schema: {
      on_delete: "CASCADE",
    },
  },
];

schema.permissions = [
  {
    collection: "csa_share_size",
    roleName: "collectivo_user",
    action: "read",
    // @ts-ignore
    fields: ["*"],
  },
  {
    collection: "csa_share_type",
    roleName: "collectivo_user",
    action: "read",
    // @ts-ignore
    fields: ["*"],
  },
];
