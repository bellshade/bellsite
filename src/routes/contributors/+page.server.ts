import { error } from '@sveltejs/kit';

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

const GITHUB_TOKEN = 'token';

export async function load() {
	try {
		const headers = {
			Authorization: `Bearer ${GITHUB_TOKEN}`,
			'X-GitHub-Api-Version': '2022-11-28'
		};
		const [membersResponse, outsideCollaboratorsResponse] = await Promise.all([
			fetch('https://api.github.com/orgs/bellshade/public_members', {
				headers
			}),
			fetch('https://api.github.com/orgs/bellshade/outside_collaborators', {
				headers
			})
		]);
		const members: GithubMember[] = await membersResponse.json();
		const outsideCollaborators: GithubOutsideCollaborator[] =
			await outsideCollaboratorsResponse.json();

		if (!membersResponse.ok && 'message' in members) {
			throw new Error(
				`Error: GitHub API returned status code ${membersResponse.status} with message: ${members.message}`
			);
		}
		if (!outsideCollaboratorsResponse.ok && 'message' in outsideCollaborators) {
			throw new Error(
				`Error: GitHub API returned status code ${outsideCollaboratorsResponse.status} with message: ${outsideCollaborators.message}`
			);
		}

		return { members, outsideCollaborators };
	} catch (err) {
		error(
			500,
			`Failed to fetch contributors for reason: ${err instanceof Error ? err.message : 'Unknown error'}`
		);
	}
}
