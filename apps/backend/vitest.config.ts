import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          globals: true,
          include: ["**/*.test.ts"],
          exclude: ["node_modules/**", "tests/integration/**"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          environment: "node",
          globals: true,
          include: ["tests/integration/**/*.test.ts"],
          setupFiles: ["./tests/integration/setup.ts"],
          globalSetup: ["./tests/integration/helpers/globalSetup.ts"],
          testTimeout: 20000,
          hookTimeout: 20000,
        },
      },
    ],
  },
});
