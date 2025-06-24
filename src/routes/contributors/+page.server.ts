import { error } from '@sveltejs/kit';

type GithubMember = {
	login: string;
	avatar_url: string;
	html_url: string;
};

type GithubOutsideCollaborator = {
	login: string;
	avatar_url: string;
	html_url: string;
};

export async function load() {
	try {
		const [membersResponse, outsideCollaboratorsResponse] = await Promise.all([
			fetch('https://api.github.com/orgs/bellshade/public_members'),
			fetch('https://api.github.com/orgs/bellshade/outside_collaborators')
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
