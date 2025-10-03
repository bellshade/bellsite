import { GITHUB_API_TOKEN } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { EntryGenerator } from './$types';
import { includedRepoNames } from '$lib';

import { Octokit } from 'octokit';

type GithubContent = {
	sha: string;
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
		const octokit = new Octokit({
			auth: GITHUB_API_TOKEN
		});
		const response = await octokit.rest.repos.getContent({
			owner: 'bellshade',
			repo: params.name,
			path: '',
			mediaType: {
				format: 'object'
			}
		});
		const data = response.data as GithubContent;

		const treeResponse = await octokit.rest.git.getTree({
			owner: 'bellshade',
			repo: params.name,
			tree_sha: data.sha,
			recursive: '1'
		});
		const treeData = treeResponse.data;

		const reducedNestedTree = treeData.tree.reduce((reduced, current) => {
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
