import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
  },
  env: {
    apiUrl: "https://api.realworld.io",
    baseUrl: "http://localhost:4200",
  },
});
