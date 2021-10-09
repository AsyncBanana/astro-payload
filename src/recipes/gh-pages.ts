import type { RecipeConfigFunction } from "../types/recipe_config";
const Config: RecipeConfigFunction = async (options, { fileExists, path }) => {
	let directoriesUp = 0;
	for (directoriesUp; directoriesUp <= 5; directoriesUp++) {
		if (await fileExists("./" + "../".repeat(directoriesUp) + ".git")) {
			break;
		}
	}
	const directory = path.resolve(
		options.cwd,
		"./" + "../".repeat(directoriesUp)
	);
	let projectDirectoryArray = options.cwd.split(path.sep);
	projectDirectoryArray = projectDirectoryArray.splice(
		projectDirectoryArray.length - directoriesUp,
		projectDirectoryArray.length
	);
	const projectDirectory = projectDirectoryArray.join("/");
	return {
		name: "GitHub pages setup",
		functions: [
			{
				type: "create_directory",
				id: "github_dir_create",
				explanation: "Creates the .github directory",
				directoryLocation: path.join(directory, ".github"),
			},
			{
				type: "create_directory",
				id: "workflows_dir_create",
				explanation: "Creates the .github workflows directory",
				directoryLocation: path.join(directory, ".github", "workflows"),
			},
			{
				type: "create_file",
				id: "action_create",
				explanation: "Creates the github pages deployment action",
				fileLocation: path.join(
					directory,
					".github",
					"workflows",
					"deploy.yml"
				),
				fileSource: (options) => {
					return `name: Github Pages Astro Deployment
on:
    push:
        branches:
           - master
           - main
jobs:
    deploy:
        name: Deploy
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v2
          - name: Setup Node
            uses: actions/setup-node@v1
            with:
                node-version: 16
          - name: Build project
            run: |
              npm install
              npm run build
              touch ${`./${projectDirectory}/${
								options.astroConfig.dist || "dist"
							}/.nojekyll`}
          - name: Deploy
            uses: s0/git-publish-subdir-action@develop
            env:
              REPO: self
              BRANCH: gh-pages
              FOLDER: ${`./${projectDirectory}/${
								options.astroConfig.dist || "dist"
							}`}
              GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
                `;
				},
			},
		],
	};
};
export default Config;
