<script lang="ts">
	import { NoSymbolIcon } from "@fvilers/heroicons-svelte/16/solid";

	type Project = {
		name: string;
		description?: string;
		image?: string;
		links: Record<string, string>;
	}

	const projects: Project[] = [
		{
			name: "Bellsite",
			description: "Website resmi Bellshade yang dibuat dengan SvelteKit",
			links: {
				"View Repository": "https://github.com/bellshade/bellsite",
				"View Website": "/"
			}
		},
		{
			name: "Craftcord",
			description: "Minecraft chat bridge plugin for Spigot/Paper designed for multiple Discord servers",
			links: {
				"View Repository": "https://github.com/bellshade/Craftcord"
			},
			image: "https://media.discordapp.net/attachments/1382037533231284244/1387484082555981845/2025-06-23_23.47.17.png?ex=685e2b7f&is=685cd9ff&hm=534605732efdb8884979d55ff403c3407e210cff0ed97d0aa7963e76da88ae8d&=&format=webp&quality=lossless&width=1322&height=744"
		},
		{
			name: "bellfetch",
			description: "Aplikasi untuk menampilkan informasi arsitektur sistem. dibuat dengan menggunakan POSIX sh",
			links: {
				"View Repository": "https://github.com/bellshade/bellfetch",
				"Installation Guide": "https://github.com/bellshade/bellfetch?tab=readme-ov-file#installasi"
			}
		}
	];
</script>

<div>
	<div
		class="mx-auto grid max-w-screen-xl grid-cols-1 gap-6 px-5 py-24 md:grid-cols-2 lg:grid-cols-3"
	>
		<h1 class="col-span-full py-8 text-center text-3xl">Bellshade Projects</h1>
		<p class="col-span-full border-b border-gray-200 pb-6 text-center text-lg">
			Projek yang dibuat oleh team dan contributor Bellshade
		</p>
		{#each projects as project}
		<div
			class="flex flex-col justify-between gap-y-4 rounded-lg border border-zinc-300 p-4 transition-colors hover:bg-zinc-100"
		>
			<div class="flex flex-col space-y-2 items-center grow">
				{#if project.image}
					<img
						src={project.image}
						alt={project.name}
						class="mb-3 h-48 w-full rounded-lg object-cover"
	 				/>
				{:else}
					<div class="mb-3 h-48 w-full flex items-center justify-center bg-zinc-200 border border-zinc-300 rounded-lg">
						<NoSymbolIcon class="size-8 text-zinc-400" />
					</div>
				{/if}

				<h2 class="text-xl underline">{project.name}</h2>
				<p class="text-sm text-justify">{project.description ?? "No description."}</p>
			</div>
			<div class="flex flex-col gap-2">
				{#each Object.entries(project.links) as [label, url]}
					<div class="flex flex-col gap-2">
						<a
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							class="block w-full rounded-md border border-zinc-300 bg-white p-2 text-center text-sm transition-transform ease-in-out hover:rotate-2 hover:bg-zinc-100"
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
