<script lang="ts">
	import { NoSymbolIcon } from '@fvilers/heroicons-svelte/16/solid';

	type Project = {
		name: string;
		description?: string;
		image?: string;
		links: Record<
			string,
			{
				isBlack: boolean;
				url: string;
			}
		>;
	};

	const projects: Project[] = [
		{
			name: 'Bellsite',
			description: 'Website resmi Bellshade yang dibuat dengan SvelteKit',
			links: {
				'View Repository': {
					isBlack: true,
					url: 'https://github.com/bellshade/bellsite'
				},
				'View Website': {
					isBlack: false,
					url: '/'
				}
			}
		},
		{
			name: 'Craftcord',
			description:
				'Minecraft chat bridge plugin for Spigot/Paper designed for multiple Discord servers',
			links: {
				'View Repository': {
					isBlack: true,
					url: 'https://github.com/bellshade/Craftcord'
				}
			},
			image:
				'https://media.discordapp.net/attachments/1382037533231284244/1387484082555981845/2025-06-23_23.47.17.png?ex=685e2b7f&is=685cd9ff&hm=534605732efdb8884979d55ff403c3407e210cff0ed97d0aa7963e76da88ae8d&=&format=webp&quality=lossless&width=1322&height=744'
		},
		{
			name: 'Bellfetch',
			description:
				'Aplikasi untuk menampilkan informasi arsitektur sistem. dibuat dengan menggunakan POSIX sh',
			links: {
				'View Repository': {
					isBlack: true,
					url: 'https://github.com/bellshade/bellfetch'
				},
				'Installation Guide': {
					isBlack: false,
					url: 'https://github.com/bellshade/bellfetch?tab=readme-ov-file#installasi'
				}
			}
		},
		{
			name: 'OpenSeries',
			description: 'Library untuk membantu temen-temen SMA/SMK/Sederajat',
			links: {
				'View Repository': {
					isBlack: true,
					url: 'https://github.com/bellshade/OpenSeries'
				},
				'Installation Guide': {
					isBlack: false,
					url: 'https://openseries.pow.kim/docs/get-started/instalasi'
				}
			},
			image: 'https://github.com/bellshade/OpenSeries/raw/main/.github/openSeries.png'
		},
		{
			name: 'WPU BOT',
			description: 'Bot Discord untuk Web Programming UNPAS',
			links: {
				'View Repository': {
					isBlack: true,
					url: 'https://github.com/bellshade/wpu_bot'
				}
			},
			image:
				'https://camo.githubusercontent.com/64a559ed2289d08eb6cc7121915c4b5631c181b7c8ebe04811f25e56e8385696/68747470733a2f2f692e696d6775722e636f6d2f4566426c3848732e706e67'
		}
	];
</script>

<div>
	<div
		class="mx-auto grid max-w-screen-xl grid-cols-1 gap-6 px-5 py-24 md:grid-cols-2 lg:grid-cols-3"
	>
		<h1 class="col-span-full py-8 text-center text-3xl dark:text-gray-300">Bellshade Projects</h1>
		<p class="col-span-full border-b border-gray-200 pb-6 text-center text-lg dark:text-gray-300">
			Projek yang dibuat oleh team dan contributor Bellshade
		</p>
		{#each projects as project}
			<div
				class="flex flex-col justify-between gap-y-4 rounded-lg border border-zinc-300 p-4 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-gray-800"
			>
				<div class="flex grow flex-col items-center space-y-2">
					{#if project.image}
						<img
							src={project.image}
							alt={project.name}
							class="mb-3 h-48 w-full rounded-lg object-cover"
						/>
					{:else}
						<div
							class="mb-3 flex h-48 w-full items-center justify-center rounded-lg border border-zinc-300 bg-zinc-200"
						>
							<NoSymbolIcon class="size-8 text-zinc-400" />
						</div>
					{/if}

					<h2 class="text-xl underline dark:text-gray-300">{project.name}</h2>
					<p class="text-justify text-sm dark:text-gray-300">
						{project.description ?? 'No description.'}
					</p>
				</div>
				<div class="flex flex-col gap-2">
					{#each Object.entries(project.links) as [label, link]}
						<div class="flex flex-col gap-2">
							<a
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								class={[
									'block w-full rounded-md border border-zinc-300 p-2 text-center text-sm transition-transform ease-in-out hover:rotate-2 dark:border-zinc-700',
									{
										'bg-zinc-800 text-white': link.isBlack,
										'bg-transparent text-black hover:bg-zinc-100 dark:text-gray-300 dark:hover:bg-gray-700':
											!link.isBlack
									}
								]}
							>
								{label}
							</a>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
