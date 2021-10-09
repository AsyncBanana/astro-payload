import type { RecipeConfigFunction } from "../types/recipe_config";
const Config: RecipeConfigFunction = (options) => {
	return {
		name: "Netlify Deployment Setup",
		functions: [
			{
				type: "create_file",
				fileLocation: "netlify.toml",
				fileSource: () => {
					return `[build]
command = "npm run build"
publish = "dist"`;
				},
				id: "netlify_toml",
				explanation: "Creates a netlify TOML file",
			},
		],
	};
};
export default Config;
