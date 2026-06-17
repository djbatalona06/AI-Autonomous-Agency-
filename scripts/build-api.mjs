import { build } from "esbuild";

/**
 * Bundles the Vercel serverless entry into a single self-contained CommonJS
 * file at `api/index.js`. Bundling inlines every relative + node_module import,
 * so the deployed function never hits Node's ESM resolver (the source repo is
 * `"type": "module"`, which otherwise breaks extensionless imports at runtime).
 */
await build({
  entryPoints: ["server/vercelEntry.ts"],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  // Shim CJS globals that bundled dependencies expect under ESM output.
  banner: {
    js: "import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);",
  },
  outfile: "api/index.js",
  logLevel: "info",
});
