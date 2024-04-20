const schema = initSchema("csaShareOfMembershipException", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "csa_share_of_membership_exception",
    meta: {
      group: "collectivo_csa_extension",
      color: "#FF8962",
      icon: "pie_chart",
    },
    schema: {},
  },
];

schema.fields = [
  ...directusSystemFields("csa_share_of_membership_exception"),
  {
    collection: "csa_share_of_membership_exception",
    field: "date_of_share_exception",
    meta: {
      interface: "datetime",
      required: true,
    },
    type: "date",
  },
  {
    collection: "csa_share_of_membership_exception",
    field: "of_share_of_membership",
    meta: {
      display: "related-values",
      interface: "select-dropdown-m2o",
      options: {
        enableCreate: false,
        template:
          "{{of_membership.csa_membership_of.first_name}}{{of_membership.csa_membership_of.last_name}}",
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
    collection: "csa_share_of_membership_exception",
    field: "csa_type_of_share_of_membership_exception",
    meta: {
      display: "raw",
      interface: "select-radio",
      options: {
        choices: [
          { text: "aussetzen", value: "suspend" },
          { text: "Depot wechseln", value: "alternate_depot" },
        ],
      },
      required: true,
    },
    schema: {
      is_nullable: false,
    },
    type: "string",
  },
  {
    collection: "csa_share_of_membership_exception",
    field: "alternate_depot",
    meta: {
      collection: "csa_share_of_membership_exception",
      display: "related-values",
      display_options: {
        template: "{{csa_depot_name}}",
      },
      field: "alternate_depot",
      hidden: true,
      interface: "select-dropdown-m2o",
      options: {
        enableCreate: false,
        template: "{{csa_depot_name}}",
      },
      readonly: false,
      required: false,
      special: ["m2o"],
      conditions: [
        {
          hidden: false,
          name: "type is alternate_depot",
          options: {
            enableCreate: false,
            enableSelect: true,
          },
          required: true,
          rule: {
            _and: [
              {
                csa_type_of_share_of_membership_exception: {
                  _eq: "alternate_depot",
                },
              },
            ],
          },
        },
      ],
      
    },
    schema: {
      is_nullable: true,
    },
    type: "integer",
  },
];

schema.relations = [
  {
    collection: "csa_share_of_membership_exception",
    field: "of_share_of_membership",
    meta: {
      one_field: "csa_share_of_membership_exceptions",
      sort_field: null,
    },
    related_collection: "csa_share_of_membership",
    schema: {
      on_delete: "CASCADE",
    },
  },
  {
    collection: "csa_share_of_membership_exception",
    field: "alternate_depot",
    meta: {
      one_field: "exceptional_pick_ups",
      sort_field: null,
    },
    related_collection: "csa_depot",
    schema: {
      on_delete: "SET NULL",
    },
  },
];

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
