import pkg from "../../package.json";
import s001_test_migration from "../schemas/001_schema_csa_membership_test";
import s001_csa_share from "../schemas/001_schema_csa_share";
import s001_csa_share_of_membership from "../schemas/001_schema_csa_share_of_membership";
import s001_csa_depot from "../schemas/001_schema_csa_depot";
import examples from "../examples/examples";

// Register extension on startup
export default defineNitroPlugin(() => {
  registerExtension({
    name: "collectivo-csa",
    description: pkg.description,
    version: pkg.version,
    schemas: [
      combineSchemas("collectivo-csa", "0.0.1", [
        s001_test_migration,
        s001_csa_share_of_membership,
        s001_csa_share,
        s001_csa_depot,
      ]),
    ],
    examples: examples,
  });
});
