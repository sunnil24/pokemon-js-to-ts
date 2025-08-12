module.exports = {
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/src/context/pokemonContext/pokemon.context.type.ts",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  testEnvironment: "jsdom",
};
