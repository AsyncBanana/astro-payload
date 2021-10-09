import { build } from "esbuild";
import { globPlugin } from "esbuild-plugin-glob";

build({
	entryPoints: [
		"src/index.ts",
		"src/utils/index.ts",
		"src/cli/index.ts",
		"src/recipes/*",
	],
	minify: false,
	outdir: "dist",
	format: "esm",
	bundle: true,
	external: ["mico-spinner", "picocolors", "commander", "enquirer", "execa"],
	platform: "node",
	plugins: [globPlugin()],
});
