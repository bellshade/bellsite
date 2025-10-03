// place files you want to import through the `$lib` alias in this folder.

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
	'fortran'
];

export const resolve = (...paths: string[]) => {
	return paths.reduce((p, c) => {
		const pSplit = p.split('/');
		const cSplit = c.split('/');

		for (const part of cSplit) {
			if (part == '..') {
				pSplit.pop();
			} else if (part != '.' && part != '') {
				pSplit.push(part);
			}
		}

		return pSplit.join('/');
	});
};
