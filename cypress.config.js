import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8000",
    specPattern: "tests/cypress/e2e/**/*.cy.js",
    supportFile: "tests/cypress/support/e2e.js",
    // defaultCommandTimeout: 8000, // jeśli potrzebujesz
  },
});
