/* eslint-disable */
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "max-len": ["error", { code: 2000, ignoreUrls: true }],
    ...require("eslint-config-prettier").rules,
    ...require("eslint-config-prettier/@typescript-eslint").rules,
  },
};
