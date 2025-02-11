import { defineConfig } from "tsup"

export default defineConfig({
  format: ["cjs", "esm"],
  entry: ["./src/hcl.ts"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  jsx: "automatic",
  clean: true,
})
