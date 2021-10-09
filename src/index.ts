import type {
	RecipeConfig,
	RecipeConfigFunction,
	RecipeOptions,
} from "./types/recipe_config";
import type { FunctionOptions } from "./types/function_types";
import { getPackageManager } from "./utils/getPackageManager";
import { cwd } from "node:process";
import functions from "./function_array";
import { resolve, sep, join, delimiter } from "node:path";
import { access, readFile } from "node:fs/promises";
export async function executeRecipe(
	config: RecipeConfig | RecipeConfigFunction,
	options: RecipeOptions
) {
	if (!options.cwd) {
		options.cwd = cwd();
	}
	if (!options.packageManager) {
		options.packageManager = getPackageManager(options.cwd);
	}
	if (typeof config === "function") {
		config = await Promise.resolve(
			config(options, {
				getFile: async (path) => {
					return (await readFile(resolve(options.cwd, path))).toString();
				},
				fileExists: async (path) => {
					try {
						await access(resolve(options.cwd, path));
					} catch {
						return false;
					}
					return true;
				},
				path: {
					sep: sep,
					resolve: resolve,
					join: join,
					delimiter: delimiter,
				},
			})
		);
	}
	let promptList = {};
	if (config.prompts) {
		config.prompts.forEach(async (prompt) => {
			if (options.promptCallback) {
				promptList[prompt.variable] = await Promise.resolve(
					options.promptCallback(prompt.name, prompt.explanation)
				);
			} else {
				promptList[prompt.variable] = prompt.default;
			}
		});
	}
	const functionOptions: FunctionOptions = {
		cwd: resolve(options.cwd),
		packageManager: options.packageManager,
		variables: promptList,
		astroConfigLocation: resolve(
			options.cwd,
			options.astroConfigLocation || "astro.config.mjs"
		),
		astroConfig: await import(
			resolve(
				options.cwd ? options.cwd : cwd(),
				options.astroConfigLocation || "astro.config.mjs"
			)
		),
	};
	const functionPromises = [];
	config.functions.forEach((recipeFunction) => {
		if (functions[recipeFunction.type]) {
			if (options.hooks?.beforeFunction) {
				options.hooks.beforeFunction(recipeFunction);
			}
			functionPromises.push(
				// @ts-ignore
				functions[recipeFunction.type](recipeFunction, functionOptions)
					.then(() => {
						if (options.hooks?.afterFunction) {
							options.hooks.afterFunction(recipeFunction, true);
						}
					})
					.catch((err) => {
						console.log(err);
						options.hooks.afterFunction(recipeFunction, false);
					})
			);
		} else {
			throw new Error(
				`Recipe has uses undefined function ${recipeFunction.type}`
			);
		}
	});
	await Promise.all(functionPromises);
}
