import type {
	DependencyInstall,
	FileCreate,
	DirectoryCreate,
	PlainTransform,
	FunctionOptions,
} from "./function_types";
import type { PackageManager } from "../utils/getPackageManager";
export interface Prompt {
	name: string;
	variable: string;
	explanation: string;
	default: any;
}
export type FunctionTypes =
	| DependencyInstall
	| FileCreate
	| DirectoryCreate
	| PlainTransform;
export interface RecipeConfig {
	name: string;
	description?: string;
	functions: Array<FunctionTypes>;
	prompts?: Prompt[];
}

export type RecipeOptions = Partial<{
	cwd: string;
	packageManager: PackageManager;
	promptCallback: (
		prompt: string,
		explanation: string
	) => string | Promise<string>;
	astroConfigLocation: string;
	hooks: Partial<{
		beforeFunction: (options: FunctionTypes) => void;
		afterFunction: (options: FunctionTypes, successful: boolean) => void;
	}>;
}>;
export interface RecipeMethods {
	getFile: (path: string) => Promise<string>;
	fileExists: (path: string) => Promise<boolean>;
	path: {
		resolve(...pathSegments: string[]): string;
		join(...pathSegments: string[]): string;
		// sep: `/	` | `\\\\`;
		sep: string;
		delimiter: string;
	};
}
export type RecipeConfigFunction = (
	recipeOptions: RecipeOptions,
	recipeMethods: RecipeMethods
) => RecipeConfig | Promise<RecipeConfig>;
