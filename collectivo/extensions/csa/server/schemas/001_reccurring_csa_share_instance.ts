const schema = initSchema("recurringShareInstance", "0.0.1");

export default schema;

schema.collections = [
 {
    collection: "csa_recurring_share_instance"
}   
]

schema.fields = [
    {
        collection: "csa_recurring_share_instance",
        field: "for_delivery",
        type: "integer",
        meta:{
            display: "related-values",
            interface: "select-dropdown-m2o",
            options: {
                enableCreate: false,
            },
            special: ["m2o"],
        },

    },
    {
        collection: "csa_recurring_share_instance",
        field: "for_share_of_membership",
        type: "integer",
        meta: {
            display: "related-values",
            interface: "select-dropdown-m2o",
            options: {
                enableCreate: false,
            },
            special: ["m2o"],
        }
    }
]

schema.relations = [
    {
      collection: "csa_recurring_share_instance",
      field: "for_delivery",
      meta: {
        one_field: "csa_recurring_share_instance",
      },
      related_collection: "csa_delivery",
      schema: {
        on_delete: "CASCADE",
      }
    }
]