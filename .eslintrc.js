module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020, // Modern JS features
    sourceType: "module", // ES modules
    ecmaFeatures: {
      jsx: true, // Enable JSX parsing
    },
    project: "./tsconfig.json", // Enables type-aware linting
  },
  plugins: ["@typescript-eslint", "react"],
  extends: [
    "plugin:react/recommended", // React recommended rules
    "plugin:@typescript-eslint/recommended", // TypeScript recommended rules
    "react-app", // CRA base rules (optional, if CRA setup)
  ],
  rules: {
    // Customize your rules here
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "react/react-in-jsx-scope": "off", // Not needed with React 17+
    "react/prop-types": "off", // Using TS for prop types instead
  },
  settings: {
    react: {
      version: "detect", // Detect React version automatically
    },
  },
  env: {
    browser: true,
    node: true,
    jest: true, // Enables jest globals
  },
};
