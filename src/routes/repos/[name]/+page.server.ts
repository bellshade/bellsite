import { error } from '@sveltejs/kit';

type GithubContent = {
	sha: string;
};

export async function load({ params }: { params: { name: string } }) {
	try {
		const response = await fetch(
			`https://api.github.com/repos/bellshade/${params.name}/contents/`,
			{
				headers: {
					Accept: 'application/vnd.github.object+json'
				}
			}
		);
		const json: GithubContent = await response.json();

		if (!response.ok && 'message' in json) {
			throw new Error(
				`Error: GitHub API returned status code ${response.status} with message: ${json.message}`
			);
		}

		const treeResponse = await fetch(
			`https://api.github.com/repos/bellshade/${params.name}/git/trees/${json.sha}?recursive=1`,
			{
				headers: {
					Accept: 'application/vnd.github+json'
				}
			}
		);
		const treeJson = await treeResponse.json();

		if (!treeResponse.ok && 'message' in treeJson) {
			throw new Error(
				`Error: GitHub API returned status code ${treeResponse.status} with message: ${treeJson.message}`
			);
		}

		return {
			contents: treeJson
		};
	} catch (err) {
		error(
			500,
			`Failed to fetch repository contents for reason: ${err instanceof Error ? err.message : 'Unknown error'}`
		);
	}
}
