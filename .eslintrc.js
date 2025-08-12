module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
  },
  extends: [
    "react-app",
    "react-app/jest",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  plugins: ["@typescript-eslint", "react"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          "*.test",
          "*.spec",
          "*/*.test",
          "*/*.spec",
          "*/*.test.ts",
          "*/*.spec.ts",
          "*/*.test.tsx",
          "*/*.spec.tsx",
        ],
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
