<script lang="ts">
	import Markdown from '$lib/components/Markdown.svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import type { GithubMember } from './+page.server';

	const map = new SvelteMap<string, string>();

	const { data } = $props();
	let modalOpen: string | null = $state(null);
	let modalData = $state<string | { content: string }>('');
	let loading = $state(false);

	async function handleOpenModal(e: MouseEvent, contributor: GithubMember) {
		e.preventDefault();
		modalOpen = contributor.login;
		loading = true;

		try {
			if (map.has(contributor.login)) {
				modalData = { content: map.get(contributor.login)! };
			} else {
				const response = await fetch(
					`https://raw.githubusercontent.com/${contributor.login}/${contributor.login}/refs/heads/main/README.md`
				);
				modalData = { content: await response.text() };
				map.set(contributor.login, modalData.content);
			}

			loading = false;
		} catch (err) {
			modalData = `Error fetching data: ${(err as unknown as Error).message}`;
		}
	}

	function closeModal() {
		modalOpen = null;
		modalData = '';
		loading = false;
	}
</script>

<svelte:head>
	<title>Bellshade - Tim</title>
</svelte:head>

<div
	class="mx-auto grid max-w-screen-xl grid-cols-1 gap-4 px-4 py-24 md:grid-cols-2 lg:grid-cols-3"
>
	<h1 class="col-span-full py-10 text-center text-3xl dark:text-gray-300">
		Kenalan yuk sama Team Bellshade!
	</h1>
	{#if data.members.length > 0 || data.outsideCollaborators.length > 0}
		{#each [...data.members, ...data.outsideCollaborators] as contributor (contributor.html_url)}
			<div class="flex flex-row items-center justify-center">
				<button
					onclick={(e) => handleOpenModal(e, contributor)}
					class="group flex w-full cursor-pointer items-center rounded-lg border border-gray-300 p-10 transition-all hover:rotate-2 hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-gray-800"
				>
					<div class="flex items-center gap-4">
						<img
							src={contributor.avatar_url}
							alt="Contributor"
							class="w-18 rounded-full transition-transform group-hover:scale-105 md:w-25"
						/>
						<p class="text-md md:text-lg dark:text-gray-300">{contributor.login}</p>
					</div>
				</button>
			</div>
		{/each}
	{:else}
		<p class="text-center text-gray-500">No contributors found.</p>
	{/if}
</div>

{#if modalOpen != null}
	<div class="fixed inset-0 z-50 flex w-full max-w-full items-center justify-center">
		<div class="h-full w-full bg-black opacity-50" onclick={closeModal}></div>
		<div class="absolute flex h-[calc(100vh-8rem)] max-w-[calc(100vw-2rem)] items-center">
			<div
				class="relative h-full max-h-[calc(100dvh-4rem)] shrink rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900"
			>
				<button
					class="absolute top-1 right-2 text-2xl font-bold text-gray-400 hover:text-gray-600"
					onclick={closeModal}
					aria-label="Close"
				>
					&times;
				</button>
				{#if loading}
					<div class="py-8 text-center dark:text-gray-300">Loading...</div>
				{:else if typeof modalData === 'string'}
					<div class="py-8 text-center text-red-500">{modalData}</div>
				{:else if modalData}
					<Markdown
						content={modalData.content}
						imageResolver={(path) =>
							path.startsWith('.')
								? new URL(
										path,
										`https://raw.githubusercontent.com/${modalOpen}/${modalOpen}/refs/heads/main/`
									).toString()
								: path}
						linkResolver={(path) =>
							path.startsWith('.')
								? new URL(
										path,
										`https://raw.githubusercontent.com/${modalOpen}/${modalOpen}/refs/heads/main/`
									).toString()
								: path}
						className="prose-pre:w-[calc(80vw-2rem)] prose-code:w-[calc(80vw-2rem)]"
					/>
				{:else}
					<div class="py-8 text-center text-gray-500">No README found.</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
