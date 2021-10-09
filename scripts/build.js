import { build } from "esbuild";
import esbuildPluginDTS from "esbuild-plugin-d.ts";
import { globPlugin } from "esbuild-plugin-glob";

build({
	entryPoints: [
		"src/index.ts",
		"src/utils/index.ts",
		"src/cli/index.ts",
		"src/recipes/*",
	],
	minify: true,
	outdir: "dist",
	format: "esm",
	bundle: true,
	external: ["mico-spinner", "picocolors", "commander", "enquirer", "execa"],
	platform: "node",
	target: "es2019",
	plugins: [esbuildPluginDTS.dtsPlugin(), globPlugin()],
});
