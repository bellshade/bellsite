import { error } from '@sveltejs/kit';

type GithubRepo = {
	id: string;
	name: string;
	full_name: string;
	description: string | null;
	html_url: string;
	stargazers_count: number;
	language: string | null;
};

export const prerender = true;

export const includedRepoNames = [
	'Python',
	'Javascript',
	'CPP',
	'PHP',
	'Golang',
	'Java',
	'Typescript',
	'Dart',
	'HTML-CSS',
	'Kotlin',
	'SQL',
	'Assembly',
	'Shell',
	'Rust',
	'Solidity',
	'Ruby',
	'Docker',
	'zig',
	'Julia',
	'fortran'
];

export async function load() {
	try {
		const response = await fetch('https://api.github.com/orgs/bellshade/repos');
		const json: GithubRepo[] = await response.json();

		if (!response.ok && 'message' in json) {
			throw new Error(
				`Error: GitHub API returned status code ${response.status} with message: ${json.message}`
			);
		}

		return {
			repos: json.filter((repo) => includedRepoNames.includes(repo.name))
		};
	} catch (err) {
		error(
			500,
			`Failed to fetch repositories for reason: ${err instanceof Error ? err.message : 'Unknown error'}`
		);
	}
}
