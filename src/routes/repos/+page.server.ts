import { includedRepoNames } from '$lib';
import { error } from '@sveltejs/kit';

import { Octokit } from 'octokit';

type GithubRepo = {
	id: number;
	name: string;
	full_name: string;
	description: string | null;
	html_url: string;
	stargazers_count?: number;
};

export const prerender = true;

export async function load() {
	try {
		const octokit = new Octokit();
		const response = await octokit.rest.repos.listForOrg({
			org: 'bellshade',
			type: 'public',
			per_page: 100
		});

		const data: GithubRepo[] = response.data;


		return {
			repos: data.filter((repo) => includedRepoNames.includes(repo.name))
		};
	} catch (err) {
		error(
			500,
			`Failed to fetch repositories for reason: ${err instanceof Error ? err.message : 'Unknown error'}`
		);
	}
}
