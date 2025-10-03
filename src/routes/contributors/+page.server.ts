import { error } from '@sveltejs/kit';
import { GITHUB_API_TOKEN } from '$env/static/private';

import { Octokit } from 'octokit';

export type GithubMember = {
	login: string;
	avatar_url: string;
	html_url: string;
};

type GithubOutsideCollaborator = {
	login: string;
	avatar_url: string;
	html_url: string;
};

export const prerender = true;

export async function load() {
	try {
		const octokit = new Octokit({
			auth: GITHUB_API_TOKEN
		});
		const [membersResponse, outsideCollaboratorsResponse] = await Promise.all([
			octokit.rest.orgs.listPublicMembers({
				org: 'bellshade'
			}),
			octokit.rest.orgs.listOutsideCollaborators({
				org: 'bellshade'
			})
		]);
		const members: GithubMember[] = membersResponse.data;
		const outsideCollaborators: GithubOutsideCollaborator[] = outsideCollaboratorsResponse.data;

		return { members, outsideCollaborators };
	} catch (err) {
		error(
			500,
			`Failed to fetch contributors for reason: ${err instanceof Error ? err.message : 'Unknown error'}`
		);
	}
}
