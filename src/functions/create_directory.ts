import type { DirectoryCreate, FunctionOptions } from "../types/function_types";
import { mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
export default async function (
	config: DirectoryCreate,
	options: FunctionOptions
) {
	if (!existsSync(resolve(options.cwd, config.directoryLocation))) {
		mkdirSync(resolve(options.cwd, config.directoryLocation));
	}
}
