import type {
	DependencyInstall,
	FunctionOptions,
} from "../types/function_types";
import { PackageManager, getPackageManagerString } from "../utils";
import execa from "execa";
export default async function (
	config: DependencyInstall,
	options: FunctionOptions
) {
	let args = [
		options.packageManager === PackageManager.NPM ? "install" : "add",
	];
	let devArgs = [
		options.packageManager === PackageManager.NPM ? "install" : "add",
		"-D",
	];
	config.dependencies.forEach((dependency) => {
		if (dependency.isDevDependency) {
			devArgs.push(
				dependency.version
					? `${dependency.name}@${dependency.version}`
					: dependency.name
			);
		} else if (dependency.isDevDependency) {
			args.push(
				dependency.version
					? `${dependency.name}@${dependency.version}`
					: dependency.name
			);
		}
	});
	let PromiseArray = [];
	if (args.length > 2) {
		PromiseArray.push(
			execa(getPackageManagerString(options.packageManager), args)
		);
	}
	if (devArgs.length > 2) {
		PromiseArray.push(
			execa(getPackageManagerString(options.packageManager), devArgs)
		);
	}
	return await Promise.all(PromiseArray);
}
