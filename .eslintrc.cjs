module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    // "plugin:react/recommended", (see below)
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react"],
  rules: {
    // For the time being, only use the following rules from react
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
  },
};
