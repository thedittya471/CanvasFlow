import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/prop-types": "off",
      "turbo/no-undeclared-env-vars": "off",
      "no-undef": "off",
    },
  },
];
