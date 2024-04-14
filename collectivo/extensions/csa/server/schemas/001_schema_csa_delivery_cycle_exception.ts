const schema = initSchema("csa_delivery_cycle_exception", "0.0.1");

export default schema;

schema.collections = [
    {
        collection: "csa_delivery_cycle_exception",
        meta: {
            group: "collectivo_csa_extension",
            color: "#FF8962",
            icon: "local_shipping",
            //sort_field: "sort",
        },
        schema: {}
    },
];

schema.fields = [
    ...directusSystemFields("csa_delivery_cycle_exception"),
    {
        collection: "csa_delivery_cycle_exception",
        field: "of_delivery_cycle",
        meta: {
            //collection: "csa_delivery_cycle",
            display: "related-values",
            display_options: {
                template: "{{name_of_delivery_cycle}} {{type_of_delivery_cycle}}"
            },
            //field: "delivery_cycle_exceptions",
            //hidden: false,
            interface: "select-dropdown-m2o",
            note: "to which delivery cycle does this exception belong? (will be filled out automatically if you create from within delivery cycle)",
            one_deselect_action: "delete",
            options: {
                enableCreate: false,
                template: "{{name_of_delivery_cycle}}",
            },
            //readonly: false,
            required: true,
            special: ["m2o"],
        },
        schema: {
            is_nullable: false,
        },
        type: "integer"
    },
   
    {
        collection: "csa_delivery_cycle_exception",
        field: "type_of_exception",
        type: "string",
        meta: {
            interface: "select-radio",
            options: {
                choices: [
                    {text: "absagen", value: "cancelled"},
                    {text: "verschieben", value: "postponed"},
                    {text: "zusätzliche Lieferung", value: "additional"},
                ],
                required: true,
            }
        },
        schema: {
            default_value: null,
        }
    },
    {
        collection: "csa_delivery_cycle_exception",
        field: "original_delivery_date",
        type: "date",
        meta: {
            display: "datetime",
            display_options: {},
            interface: "datetime",
            note: "the delivery date you want to postpone, cancel or add to your delivery cycle",
            required: true,
        },
        schema: {
            is_nullable: false,
        }
    },
    {
        collection: "csa_delivery_cycle_exception",
        field: "new_delivery_date",
        type: "date",
        meta: {
            conditions: [
                {
                    hidden: false,
                    name: "if type of exception is 'postponed'",
                    options: {
                        includeSeconds: false,
                        use24: true,
                    },
                    required: true,
                    rule: {
                        _and: [
                            {
                                type_of_exception: {
                                    _eq: "postponed"
                                }
                            }
                        ]
                    }
                },
            ],
            hidden: true,
            interface: "datetime",
            note: "the date on which the delivery will take place instead",
        },
        schema: {}
    },
    
    
];

schema.relations = [
    {
        collection: "csa_delivery_cycle_exception",
        field: "of_delivery_cycle",
        meta: {       
            one_field: "csa_delivery_cycle_exception",
            //sort_field: null,
        },
        related_collection: "csa_delivery_cycle",
        schema: {
            on_delete: "CASCADE",      
        }
    }
]