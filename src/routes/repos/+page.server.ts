import { GITHUB_API_TOKEN } from '$env/static/private';
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

export type Contributor = {
	login?: string;
	avatar_url?: string;
	html_url?: string;
};

type CompleteRepoData = GithubRepo & {
	contributors: Contributor[]
};

export const prerender = true;

export async function load() {
	try {
		const octokit = new Octokit({
			auth: GITHUB_API_TOKEN
		});
		const response = await octokit.rest.repos.listForOrg({
			org: 'bellshade',
			type: 'public',
			per_page: 100
		});

		const data: GithubRepo[] = response.data.filter((repo) => includedRepoNames.includes(repo.name));
		const res: CompleteRepoData[] = [];

		for (const repo of data) {
			const contributors = await octokit.rest.repos.listContributors({
				owner: 'bellshade',
				repo: repo.name
			});

			res.push({
				...repo,
				contributors: contributors.data.filter(u => u.type !== "Bot").slice(0, 5)
			});
		}

		return {
			repos: res
		}
	} catch (err) {
		error(
			500,
			`Failed to fetch repositories for reason: ${err instanceof Error ? err.message : 'Unknown error'}`
		);
	}
}
