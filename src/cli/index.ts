#!/usr/bin/env node
import { Command, InvalidOptionArgumentError } from "commander";
import color from "picocolors";
import createSpinner from "mico-spinner";
import { executeRecipe } from "..";
import enquirer from "enquirer";
import {
	getPackageManagerFromString,
	PackageManager,
} from "../utils/getPackageManager";

const version = "0.0.1";
const program = new Command()
	.version(version)
	.argument("Recipe", "The recipe to be executed")
	.option(
		"--config <configLocation>",
		"Astro config location",
		"astro.config.mjs"
	)
	.option("--quiet", "Silence extra output", false)
	.option<PackageManager | string>(
		"--packagemanager <packageManager>",
		"Package manager in use",
		(packageManager) => {
			if (packageManager === "auto") {
				return packageManager;
			}
			const truePackageManager = getPackageManagerFromString(packageManager);
			if (truePackageManager === PackageManager.Invalid) {
				throw new InvalidOptionArgumentError("Invalid package manager");
			} else {
				return truePackageManager;
			}
		},
		"auto"
	)
	.action(async (recipe, options) => {
		if (recipe) {
			const spinner = createSpinner(
				color.bold("Loading and executing recipe")
			).start();
			try {
				const res = await import(`../recipes/${recipe}.js`);
				console.log(`Loaded recipe ${recipe} from default recipes`);
				const spinners = {};
				await executeRecipe(res.default, {
					promptCallback: async (name, explanation) => {
						return (
							await enquirer.prompt({
								type: "input",
								name: name,
								message: explanation,
							})
						)[name];
					},
					astroConfigLocation: options.config,
					packageManager:
						options.packagemanager === "auto" ? null : options.packageManager,
					hooks: {
						beforeFunction: options.quiet
							? () => {}
							: (functionOpts) => {
									if (functionOpts.type === "create_directory") {
										spinners[functionOpts.id] = createSpinner(
											`Creating directory ${functionOpts.directoryLocation}`
										).start();
									} else if (functionOpts.type === "install_dependency") {
										spinners[functionOpts.id] = createSpinner(
											`Installing ${
												functionOpts.dependencies.length === 1
													? "dependency"
													: "dependencies"
											} ${functionOpts.dependencies.join(" and ")}`
										).start();
									} else if (functionOpts.type === "create_file") {
										spinners[functionOpts.id] = createSpinner(
											`Creating file ${functionOpts.fileLocation}`
										).start();
									} else if (functionOpts.type === "transform_plain") {
										spinners[functionOpts.id] = createSpinner(
											`Rewriting file ${functionOpts.fileLocation}`
										).start();
									}
							  },
						afterFunction: options.quiet
							? () => {}
							: (functionOpts, successful) => {
									if (spinners[functionOpts.id]) {
										if (successful) {
											spinners[functionOpts.id].succeed();
										} else {
											spinners[functionOpts.id].fail();
											throw new Error("Recipe step failed");
										}
									}
							  },
					},
				});
				spinner.succeed();
				console.log(color.green(`Recipe execution successful`));
			} catch (err) {
				spinner.fail();
				console.error(color.red(`Error: ${err}`));
			}
		}
	})
	.parseAsync();
