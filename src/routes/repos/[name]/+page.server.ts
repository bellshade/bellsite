import { GITHUB_API_TOKEN } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { EntryGenerator } from './$types';
import { includedRepoNames } from '../+page.server';

type GithubContent = {
	sha: string;
};

type GithubTree = {
	url: string;
	tree: {
		path: string;
		sha: string;
		type: 'blob' | 'tree';
	}[];
};

export type MappedTree = { [key: string]: MappedTree | null };

export const prerender = true;

export const entries: EntryGenerator = () => {
	return includedRepoNames.map((name) => ({
		name
	}));
};

export async function load({ params }: { params: { name: string } }) {
	try {
		const response = await fetch(
			`https://api.github.com/repos/bellshade/${params.name}/contents/`,
			{
				headers: {
					Accept: 'application/vnd.github.object+json',
					Authorization: `Bearer ${GITHUB_API_TOKEN}`
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
					Accept: 'application/vnd.github+json',
					Authorization: `Bearer ${GITHUB_API_TOKEN}`
				}
			}
		);
		const treeJson: GithubTree = await treeResponse.json();

		if (!treeResponse.ok && 'message' in treeJson) {
			throw new Error(
				`Error: GitHub API returned status code ${treeResponse.status} with message: ${treeJson.message}`
			);
		}

		const reducedNestedTree = treeJson.tree.reduce((reduced, current) => {
			const split = current.path.split('/');

			const prevs = split.slice(0, -1);
			const child = split.at(-1)!;

			let curr = reduced;
			for (const prev of prevs) curr = curr[prev]!;

			if (current.type === 'tree' && !(child in curr)) {
				curr[child] = {};
			} else if (current.type === 'blob') {
				curr[child] = null;
			}

			return reduced;
		}, {} as MappedTree);

		return {
			contents: reducedNestedTree,
			repoName: params.name
		};
	} catch (err) {
		error(
			500,
			`Failed to fetch repository contents for reason: ${err instanceof Error ? err.message : 'Unknown error'}`
		);
	}
}
