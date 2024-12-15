const schema = initSchema("com_unit", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "com_unit",
    meta: {
      group: "collectivo_csa_commissioning",
      color: "#00ff80",
      icon: "weight",
    },
    schema: {},
  },
];

schema.fields = [
  ...directusSystemFields("com_unit"),
  {
    collection: "com_unit",
    field: "name_of_unit",
    type: "string",
    meta: {
      interface: "input",
      required: true,
    },
  },
];
