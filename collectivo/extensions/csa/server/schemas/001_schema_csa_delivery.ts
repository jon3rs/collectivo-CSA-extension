const schema = initSchema("csaDelivery", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "csa_delivery",
    meta: {},
    schema: {},
  },
];

schema.fields = [
  ...directusSystemFields("csa_delivery"),

  {
    collection: "csa_delivery",
    field: "date_of_delivery",
    type: "dateTime",
    meta: {
      interface: "datetime",
    },
  },
  {
    collection: "csa_delivery",
    field: "csa_recurring_share_instance",
    meta: {
      interface: "list-o2m",
      special: ["o2m"],
    },
    type: "alias",
  },
];

schema.permissions = [
  {
    collection: "csa_delivery",
    roleName: "collectivo_admin",
    action: "create",
    // @ts-ignore
    fields: ["*"],
  },
  {
    collection: "csa_delivery",
    roleName: "collectivo_admin",
    action: "update",
    // @ts-ignore
    fields: ["*"],
  },
  {
    collection: "csa_delivery",
    roleName: "collectivo_admin",
    action: "delete",
    // @ts-ignore
    fields: ["*"],
  },
  {
    collection: "csa_delivery",
    roleName: "collectivo_user",
    action: "read",
    // @ts-ignore
    fields: ["*"],
  },
];
