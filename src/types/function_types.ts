import type { PackageManager } from "../utils/getPackageManager";
import type AstroConfig from "./astro_config";

export interface BaseFunction {
	id: string;
	explanation: string;
}
export interface FunctionOptions {
	cwd: string;
	packageManager: PackageManager;
	variables: Record<string, unknown>;
	astroConfigLocation: string;
	astroConfig: AstroConfig;
}
export interface SearchMethods {
	exists: (filePath: string) => boolean;
	resolve: (...filePaths: string[]) => string;
}
export interface DependencyInstall extends BaseFunction {
	type: "install_dependency";
	dependencies: { name: string; version?: string; isDevDependency?: boolean }[];
}
export interface PlainTransform extends BaseFunction {
	type: "transform_plain";
	fileLocation: string;
	fileSource: (
		fileSource: string,
		options: FunctionOptions
	) => string | Promise<string>;
}
export interface FileCreate extends BaseFunction {
	type: "create_file";
	fileLocation: string;
	fileSource: (options: FunctionOptions) => string | Promise<string>;
}
export interface DirectoryCreate extends BaseFunction {
	type: "create_directory";
	directoryLocation: string;
}
