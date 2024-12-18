import pkg from "../../package.json";
import s001_commissioning_folder from "../schemas/001_schema_commissioning_folder";
import s001_unit from "../schemas/001_schema_unit";
import s001_test from "../schemas/001_com_test";
import s001_crop from "../schemas/001_schema_crop";
import s001_harvest_item from "../schemas/001_schema_harvest_item";
import s001_harvest from "../schemas/001_schema_harvest";
import s001_commissioning from "../schemas/001_schema_commissioning";
import s001_share_size from "../schemas/001_schema_com_share";
import s001_share_size_group from "../schemas/001_schema_share_size_group";
import s001_schema_member_group from "../schemas/001_schema_member_group";
import s001_distributed_partial_harvest_item from "../schemas/001_schema_distributed_partial_harvest_item";
import examples from "../examples/examples";

// Register extension on startup
export default defineNitroPlugin(() => {
  registerExtension({
    name: "commissioning",
    description: pkg.description,
    version: pkg.version,
    schemas: [
      combineSchemas("commissioning", "0.0.1", [
        s001_commissioning_folder,
        s001_unit,
        s001_crop,
        s001_harvest_item,
        s001_harvest,
        s001_share_size,
        s001_commissioning,
        s001_share_size_group,
        s001_schema_member_group,
        s001_distributed_partial_harvest_item,
      ]),
    ],
    /* examples: examples, */
  });
});
