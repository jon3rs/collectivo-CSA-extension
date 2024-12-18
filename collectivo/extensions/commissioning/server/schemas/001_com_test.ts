const schema = initSchema("com_test", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "com_test",
    meta: {
      group: "collectivo_csa_commissioning",
      color: "#00ff80",
      icon: "person_play",
    },
  },
];

schema.fields = [
  ...directusSystemFields("com_test"),
  {
    collection: "com_test",
    field: "input_field",
    meta: {
      interface: "input",
    },
    type: "string",
  },
];
