import type { FileCreate, FunctionOptions } from "../types/function_types";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
export default async function (config: FileCreate, options: FunctionOptions) {
	writeFileSync(
		resolve(options.cwd, config.fileLocation),
		await Promise.resolve(config.fileSource(options))
	);
}
