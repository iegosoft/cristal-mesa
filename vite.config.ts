// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// When deploying to Vercel, set the env var DEPLOY_TARGET=vercel.
// Otherwise the project keeps building for Cloudflare (default in Lovable).
const target = process.env.DEPLOY_TARGET === "vercel" ? "vercel" : undefined;

export default defineConfig({
  tanstackStart: target ? { target } : undefined,
});
