<script lang="ts">
	import { StarIcon } from '@fvilers/heroicons-svelte/16/solid';

	const { data } = $props();

	const repoLogos: { [key: string]: string } = {
		python: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
		javascript:
			'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
		cpp: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
		php: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg',
		java: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
		kotlin: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg',
		sql: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg',
		dart: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg',
		golang: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg',
		typescript:
			'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
		'html-css':
			'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
		shell:
			'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/powershell/powershell-original.svg',
		rust: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg',
		zig: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/zig/zig-original.svg',
		docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
		fortran:
			'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fortran/fortran-original.svg',
		solidity:
			'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/solidity/solidity-original.svg',
		assembly: 'https://static.cdnlogo.com/logos/n/79/netwide-assembler.svg'
	};
</script>

<div>
	<div
		class="mx-auto grid max-w-screen-xl grid-cols-1 gap-6 px-5 py-24 md:grid-cols-2 lg:grid-cols-3"
	>
		<h1 class="col-span-full py-8 text-center text-3xl dark:text-gray-300">
			Bellshade Repositories
		</h1>
		<p class="col-span-full border-b border-gray-200 pb-6 text-center text-lg dark:text-gray-300">
			Tempat belajar yang dibuat oleh team dan contributor Bellshade
		</p>
		{#each data.repos as repo}
			<div
				class="group flex flex-col gap-y-4 rounded-lg border border-zinc-300 bg-white p-4 transition-colors hover:bg-zinc-100 dark:border-gray-600 dark:bg-gray-900 dark:hover:bg-gray-800"
			>
				<div class="relative flex-grow space-y-2">
					<img
						src={repoLogos[repo.name.toLowerCase()] ?? ''}
						alt={repo.name}
						class="absolute -top-3 right-0 z-10 w-24 opacity-0 duration-200 group-hover:opacity-20"
					/>
					<div class="flex flex-wrap gap-5">
						<h2 class="text-xl underline dark:text-gray-300">{repo.name}</h2>
						<div class="flex items-center gap-1">
							<p class="text-sm dark:text-gray-300">{repo.stargazers_count}</p>
							<StarIcon class="size-4 flex-shrink-0 dark:text-gray-300" />
						</div>
					</div>
					<p class="relative z-100 text-sm dark:text-gray-300">
						{repo.description ?? 'No description.'}
					</p>
				</div>
				<div class="flex flex-col gap-2">
					<a
						href="/repos/{repo.name}"
						class="block w-full rounded-md border border-zinc-300 bg-zinc-800 p-2 text-center text-sm text-white transition-transform hover:rotate-2 dark:border-zinc-700"
						>View in Browser</a
					>
					<a
						href={repo.html_url}
						target="_blank"
						rel="noopener noreferrer"
						class="block w-full rounded-md border border-zinc-300 bg-transparent p-2 text-center text-sm transition-colors transition-transform ease-in-out hover:rotate-2 hover:bg-zinc-100 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-gray-700"
						>View Repository</a
					>
				</div>
			</div>
		{/each}
	</div>
</div>
