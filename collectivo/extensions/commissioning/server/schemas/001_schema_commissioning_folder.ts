const schema = initSchema({
  collection: "csa_commissioning_folder",
  version: "0.0.1",
});

export default schema;

schema.collections = [
  {
    collection: "collectivo_csa_commissioning",
    meta: {
      collection: "collectivo_csa_commissioning",
      icon: "folder",
      color: "#00ff80",
    },
  },
];
