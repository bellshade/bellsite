<script lang="ts">
	import { StarIcon } from '@fvilers/heroicons-svelte/16/solid';

	const { data } = $props();
</script>

<div class="mx-auto grid max-w-screen-xl grid-cols-1 gap-6 px-5 md:grid-cols-2 lg:grid-cols-3">
	{#each data.repos as repo}
		<div
			class="flex flex-col gap-y-4 rounded-lg border border-zinc-300 p-4 transition-colors hover:bg-zinc-100"
		>
			<div class="flex-grow space-y-2">
				<div class="flex flex-wrap justify-between gap-1">
					<h2 class="text-xl underline">{repo.name}</h2>
					<div class="flex items-center gap-1">
						<p class="text-sm">{repo.stargazers_count}</p>
						<StarIcon class="size-4 flex-shrink-0" />
					</div>
				</div>
				<p class="text-sm">{repo.description ?? 'No description.'}</p>
			</div>
			<div class="flex flex-col gap-2">
				<a
					href={repo.html_url}
					target="_blank"
					rel="noopener noreferrer"
					class="block w-full rounded-md border border-zinc-300 bg-zinc-800 p-2 text-center text-sm text-white"
					>View in Browser</a
				>
				<a
					href={repo.html_url}
					target="_blank"
					rel="noopener noreferrer"
					class="block w-full rounded-md border border-zinc-300 bg-white p-2 text-center text-sm transition-colors hover:bg-zinc-100"
					>View Repository</a
				>
			</div>
		</div>
	{/each}
</div>
