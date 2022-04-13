module.exports = {
  env: {
    browser: false,
    "shared-node-browser": true,
    es2021: true,
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  rules: {},
};
