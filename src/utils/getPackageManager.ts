import { resolve } from "node:path";
import { existsSync } from "node:fs";
export const enum PackageManager {
	"NPM",
	"Yarn",
	"PNPM",
	"Invalid",
}
export function getPackageManager(cwd: string): PackageManager {
	if (existsSync(resolve(cwd, "pnpm-lock.yaml"))) {
		return PackageManager.PNPM;
	}
	if (existsSync(resolve(cwd, "yarn.lock"))) {
		return PackageManager.Yarn;
	}
	return PackageManager.NPM;
}
export function getPackageManagerString(
	packageManager: PackageManager
): string {
	return packageManager === PackageManager.NPM
		? "npm"
		: packageManager === PackageManager.Yarn
		? "yarn"
		: packageManager === PackageManager.PNPM
		? "pnpm"
		: "none";
}
export function getPackageManagerFromString(
	packageManager: string
): PackageManager {
	packageManager = packageManager.toLowerCase();
	return packageManager === "npm"
		? PackageManager.NPM
		: packageManager === "yarn"
		? PackageManager.Yarn
		: packageManager === "pnpm"
		? PackageManager.PNPM
		: PackageManager.Invalid;
}
