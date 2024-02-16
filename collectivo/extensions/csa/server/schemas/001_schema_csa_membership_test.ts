// This function creates an empty schema for version 0.0.1 of the example extension
// A schema can be used to declaratively define the structure of the database
const schema = initSchema("csaMembership", "0.0.1");

export default schema;

// Here you can define collections for your database
// See https://docs.directus.io/reference/system/collections.html
schema.collections = [
  {
    collection: "csa_membership",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      display_template: "{{csa_membership_of}}",
      group: "collectivo_csa_extension",
      color: "#FF8962",
      icon: "switch_account"
    },
  },
];

// Here you can define fields for your collections
// See https://docs.directus.io/reference/system/fields.html
schema.fields = [
  ...directusSystemFields("csa_membership"),

  {
    collection: "csa_membership",
    field: "csa_membership_of",
    type: "uuid",
    meta: {
      interface: "select-dropdown-m2o",
      special: ["m2o"],
      display: "related-values",
      display_options: {
        template: "{{first_name}} {{last_name}}",
      },
      options: {
        enableCreate: false,
      },
    },
  },
  {
    collection: "directus_users",
    field: "csa_membership",
    meta: {
      interface: "list-o2m",
      special: ["o2m"],
    },
    type: "alias",
  },
];

schema.relations = [
  {
    collection: "csa_membership",
    field: "csa_membership_of",
    meta: {
      one_field: "csa_membership",
    },
    related_collection: "directus_users",
    schema: {
      on_delete: "SET NULL",
    },
  },
];

// Here you can define custom translations
// See https://docs.directus.io/reference/system/translations.html
schema.translations = [];

// To create relations, you can use the following helper functions
// schema.createM2ORelation();
// schema.createM2MRelation();
// schema.createM2ARelation();

schema.permissions = [
  {
    collection: "csa_membership",
    roleName: "collectivo_user",
    action: "create",
    // @ts-ignore
    fields: ["*"],
  },
  {
    collection: "csa_membership",
    roleName: "collectivo_user",
    action: "read",
    // @ts-ignore
    fields: ["*"],
  },
  {
    collection: "csa_membership",
    roleName: "collectivo_user",
    action: "update",
    // @ts-ignore
    fields: ["*"],
  },
  {
    collection: "csa_membership",
    roleName: "collectivo_user",
    action: "delete",
    // @ts-ignore
    fields: ["*"],
  },
];
