import type { PlainTransform, FunctionOptions } from "../types/function_types";
import { writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
export default async function (
	config: PlainTransform,
	options: FunctionOptions
) {
	writeFileSync(
		resolve(config.fileLocation, options.cwd),
		await Promise.resolve(
			config.fileSource(
				readFileSync(resolve(config.fileLocation, options.cwd)).toString(),
				options
			)
		)
	);
}
