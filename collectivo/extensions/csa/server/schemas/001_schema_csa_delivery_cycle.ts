const schema = initSchema( "csa_delivery_cycle", "0.0.1" );

export default schema;

schema.collections = [
    {
        collection: "csa_delivery_cycle",
        meta: {
            group: "collectivo_csa_extension",
            color: "#FF8962",
            icon: "local_shipping",
            //sort_field: "sort",  
        },
        schema: {
        },
    },
];

schema.fields = [
    ...directusSystemFields("csa_delivery_cycle"),
    {
        collection: "csa_delivery_cycle",
        field: "name_of_delivery_cycle",
        type: "string",
        meta: {
            display: "raw",
            interface: "input",
            options: {
                placeholder: "e.g. 'vegetable deliveries season 2024'",
            }
        }
    },
    {
        collection: "csa_delivery_cycle",
        field: "type_of_delivery_cycle",
        type: "string",
        meta: {
            interface: "select-radio",
            options: {
                choices: [
                    {text: "Einmalige Lieferung", value: "single"},
                    {text: "Endlicher Lieferzyklus", value: "finite"},
                    {text: "Unendlicher Lieferzyklus", value: "infinite"},
                ],
            },
            required: true,
        },
        schema: {
            default_value: "finite",
            is_nullable: false,
        }
    },
    {
        collection: "csa_delivery_cycle",
        field: "date_of_first_delivery",
        type: "date",
        meta: {
            display: "datetime",
            interface: "datetime",
            required: true,
        }
    },
    {
        collection: "csa_delivery_cycle",
        field: "repeats_on",
        type: "integer",
        meta: {
            interface: "select-dropdown",
            required: false,
            hidden: true,
            options: {
                choices: [
                    {text: "Sunday", value: 0},
                    {text: "Monday", value: 1},
                    {text: "Tuesday", value: 2},
                    {text: "Wednesday", value: 3},
                    {text: "Thursday", value: 4},
                    {text: "Friday", value: 5},
                    {text: "Saturday", value: 6}
                ]
            },
            conditions: [
                {
                    hidden: false,
                    name: "is not a single delivery",
                    options: {
                        allowNone: false,
                        allowOther: false,
                    },
                    required: true,
                    rule: {
                        _and: [
                            {
                                type_of_delivery_cycle: {
                                    _neq: "single"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        collection: "csa_delivery_cycle",
        field: "interval_of_delivery_cycle",
        type: "string",
        meta: {
            display: "labels",
            interface: "select-dropdown",
            note: "the interval by which your delivery cycle repeats.", // what about monthly deliveries?
            options: {
                choices: [
                    {text: "wöchentlich", value: "weekly"},
                    {text: "alle zwei Wochen", value: "biweekly"},
                    {text: "erster <ausgewählter Wochentag> im Monat", value: "first_of_month"},
                    {text: "zweiter <ausgewählter Wochentag> im Monat", value: "second_of_month"},
                    {text: "dritter <ausgewählter Wochentag> im Monat", value: "third_of_month"},
                    {text: "letzter <ausgewählter Wochentag> im Monat", value: "last_of_month"},
                ]
            },
            readonly: false,
            required: false,
            hidden: true,
            conditions:[
                {
                    hidden: false,
                    name: "is not a single delivery",
                    options: {
                        allowNone: false,
                        allowOther: false,
                    },
                    required: true,
                    rule: {
                        _and: [
                            {
                                type_of_delivery_cycle: {
                                    _neq: "single"
                                }
                            }
                        ]
                    }
                }
            ],

        }
    },
    {
        collection: "csa_delivery_cycle",
        field: "date_of_last_delivery",
        type: "date",
        meta: {
            display: "datetime",
            interface: "datetime",
            note: "note",
            hidden: true,
            required: false,
            readonly: false,
            conditions: [
                {
                    hidden: false,
                    name: "is a finite delivery cycle",
                    options: {
                        includeSeconds: false,
                        use24: true,
                    },
                    required: true,
                    rule: {
                        _and: [
                            {
                                type_of_delivery_cycle: {
                                    _eq: "finite"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        collection: "csa_delivery_cycle",
        field: "csa_delivery_cycle_exception",
        meta: {
            interface: "list-o2m",   
            special: ["o2m"],
            note: "cancel, postpone or add an additional delivery to your delivery cycle",
            options: {
                enableSelect: false,
                template: "{{type_of_exception}} on {{original_delivery_date}}",
            },
            readonly: false,
            required: false,
        },
        type: "alias",
    },
   /*  {
        collection: "csa_delivery_cycle",
        field: "sort",
        type: "integer",
        meta: {
            hidden: true,
            interface: "input",
        }
    }, */
    
   
]

schema.permissions = [
    {
      collection: "csa_delivery_cycle",
      roleName: "collectivo_admin",
      action: "create",
      // @ts-ignore
      fields: ["*"],
    },
    {
      collection: "csa_delivery_cycle",
      roleName: "collectivo_admin",
      action: "update",
      // @ts-ignore
      fields: ["*"],
    },
    {
      collection: "csa_delivery_cycle",
      roleName: "collectivo_admin",
      action: "delete",
      // @ts-ignore
      fields: ["*"],
    },
    {
      collection: "csa_delivery_cycle",
      roleName: "collectivo_user",
      action: "read",
      // @ts-ignore
      fields: ["*"],
    },
  ];

  