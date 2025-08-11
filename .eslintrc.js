module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "react-app",
    "react-app/jest",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
