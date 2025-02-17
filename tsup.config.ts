import { defineConfig } from "tsup"

export default defineConfig({
  format: ["cjs", "esm"],
  entry: ["./src/hclcdp-react.ts"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  splitting: false,
  clean: true,
  watch: true,
})
