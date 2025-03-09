import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

const conditionalPlugins: [string, Record<string, any>][] = [];

// @ts-ignore
if (process.env.TEMPO === "true") {
  conditionalPlugins.push(["tempo-devtools/swc", {}]);
}

// https://vitejs.dev/config/
export default defineConfig({
  base:
    process.env.NODE_ENV === "development"
      ? "/"
      : process.env.VITE_BASE_PATH || "/",
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
    exclude: [
      "bcrypt",
      "@mapbox/node-pre-gyp",
      "mock-aws-s3",
      "aws-sdk",
      "nock",
    ],
  },
  plugins: [
    react({
      plugins: [...conditionalPlugins],
    }),
    tempo(),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
  },
  build: {
    commonjsOptions: {
      exclude: [
        "bcrypt",
        "@mapbox/node-pre-gyp",
        "mock-aws-s3",
        "aws-sdk",
        "nock",
      ],
    },
  },
});
