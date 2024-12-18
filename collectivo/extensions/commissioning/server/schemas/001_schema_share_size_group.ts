const schema = initSchema("com_share_size_group", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "com_share_size_group",
    meta: {
      group: "collectivo_csa_commissioning",
      color: "#00ff80",
      icon: "person_play",
    },
    schema: {},
  },
];

schema.fields = [
  ...directusSystemFields("com_share_size_group"),
  {
    collection: "com_share_size_group",
    field: "group_name",
    meta: {
      interface: "input",
    },
    type: "string",
  },
  {
    collection: "com_share_size_group",
    field: "com_share_sizes",
    meta: {
      interface: "list-o2m",
      special: ["o2m"],
    },
    type: "alias",
  },
];
