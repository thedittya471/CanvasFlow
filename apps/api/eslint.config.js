import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    rules: {
      // Runtime env vars (OAuth keys, auth secrets) aren't turbo build inputs —
      // suppress the undeclared-env-vars rule for the API package.
      "turbo/no-undeclared-env-vars": "off",
    },
  },
];
