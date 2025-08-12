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
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "react-app",
    "plugin:storybook/recommended",
  ],
  rules: {
    // Customize your rules here
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "react/react-in-jsx-scope": "off", // Not needed with React 17+
    "react/prop-types": "off", // Using TS for prop types instead
    "react/no-unescaped-entities": "off", // Allow unescaped entities in JSX
    "@typescript-eslint/no-empty-function": "off", // Warn on empty functions
    "@typescript-eslint/ban-ts-comment": "off", // Allow ts-ignore comments
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
