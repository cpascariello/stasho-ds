import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  transpilePackages: ["@stasho/ds"],
  turbopack: {
    root: "../..",
  },
};

export default config;
