const schema = initSchema("schema_com_commissioning", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "com_commissioning",
    meta: {
      group: "collectivo_csa_commissioning",
      color: "#00ff80",
      icon: "person_play",
    },
    schema: {},
  },
];

schema.fields = [
  ...directusSystemFields("com_commissioning"),
  {
    collection: "com_commissioning",
    field: "com_related_harvest",
    meta: {
      interface: "list-o2m",
      special: ["o2m"],
    },
    type: "alias",
  },
  {
    collection: "com_commissioning",
    field: "com_member_group",
    meta: {
      interface: "list-o2m",
      special: ["o2m"],
    },
    type: "alias",
  },
  {
    collection: "com_commissioning",
    field: "com_distributed_partial_harvest_item",
    meta: {
      interface: "list-o2m",
      special: ["o2m"],
    },
    type: "alias",
  },
];
