import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // Vitest stubs CSS imports to "" unless included; the Header test reads
    // tokens.css as raw text to pin the --ds-header-height token.
    css: { include: [/tokens\.css/] },
  },
});
