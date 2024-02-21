const schema = initSchema({ collection: "csa_collectivo_folder", version: "0.0.1" });

export default schema;

schema.collections = [
    {
        collection: "collectivo_csa_extension",
        meta:{
            collection: "collectivo_csa_extension",
            icon: "folder",
            color: "#FF8962",
        }
    }
]