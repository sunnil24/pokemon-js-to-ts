module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020, // Modern JS features
    sourceType: "module", // ES modules
    ecmaFeatures: {
      jsx: true, // Enable JSX parsing
    },
    project: ["./tsconfig.json", "./tsconfig.eslint.json"], // Enables type-aware linting
  },
  plugins: ["@typescript-eslint", "react", "jest-dom"],
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "react-app",
    "plugin:storybook/recommended",
    "plugin:jest-dom/recommended",
  ],
  rules: {
    // Customize your rules here
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "react/display-name": "off",
    "@typescript-eslint/no-var-require": "off",
    "@typescript-eslint/no-var-requires": "off",
    "import/first": "off",
    "jest-dom/prefer-to-have-value": "off",
    "jest-dom/prefer-to-have-class": "off",
    "jest-dom/prefer-in-document": "off",
    "jest-dom/prefer-to-have-attribute": "off",
    "jest-dom/prefer-to-have-text-content": "off",
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
    es6: true,
  },
};
