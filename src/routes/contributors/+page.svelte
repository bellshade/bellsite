<script lang="ts">
	import Markdown from '$lib/components/Markdown.svelte';
	import type { GithubMember } from './+page.server';

	type GitHubFileResponse = {
		content?: string;
	};

	const map = new Map();

	const { data } = $props();
	let modalOpen: string | null = $state(null);
	let modalData = $state<GitHubFileResponse | string>('');
	let loading = $state(false);

	async function handleOpenModal(e: MouseEvent, contributor: GithubMember) {
		e.preventDefault();
		modalOpen = contributor.login;
		loading = true;

		try {
			if (map.has(contributor.login)) {
				modalData = map.get(contributor.login);
			} else {
				const response = await fetch(
					`https://api.github.com/repos/${contributor.login}/${contributor.login}/contents/README.md`
				);
				modalData = await response.json();
				map.set(contributor.login, modalData);
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

	function parseBase64Data(data: string) {
		const decoded = atob(data);
		const byteArray = new Uint8Array(decoded.length);
		for (let i = 0; i < decoded.length; i++) {
			byteArray[i] = decoded.charCodeAt(i);
		}

		return new TextDecoder('utf-8').decode(byteArray);
	}
</script>

<div
	class="mx-auto grid max-w-screen-xl grid-cols-1 gap-x-4 px-4 py-24 md:grid-cols-2 lg:grid-cols-3"
>
	<h1 class="col-span-full py-10 text-center text-3xl">Kenalan yuk sama Team Bellshade!</h1>
	{#if data.members.length > 0 || data.outsideCollaborators.length > 0}
		{#each [...data.members, ...data.outsideCollaborators] as contributor}
			<div class="flex flex-row items-center justify-center">
				<button
					onclick={(e) => handleOpenModal(e, contributor)}
					class="group my-2 md:my-8 flex h-40 md:w-100 w-[calc(100vw-4rem)] cursor-pointer items-center rounded-lg border border-gray-300 p-8 transition-all hover:rotate-2 hover:bg-gray-100 md:h-50"
				>
					<div class="flex items-center gap-4">
						<img
							src={contributor.avatar_url}
							alt="Contributor"
							class="w-18 rounded-full transition-transform group-hover:scale-105 md:w-25"
						/>
						<p class="text-md md:text-lg">{contributor.login}</p>
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
		<div class="absolute flex items-center max-w-[calc(100vw-2rem)] h-[calc(100vh-8rem)]">
			<div
				class="relative h-full max-h-[calc(100dvh-4rem)] overflow-y-scroll rounded-lg bg-white p-8 shadow-lg shrink"
			>
				<button
					class="absolute top-1 right-2 text-2xl font-bold text-gray-400 hover:text-gray-600"
					onclick={closeModal}
					aria-label="Close"
				>
					&times;
				</button>
				{#if loading}
					<div class="py-8 text-center">Loading...</div>
				{:else if typeof modalData === 'string'}
					<div class="py-8 text-center text-red-500">{modalData}</div>
				{:else if modalData && modalData.content}
					<Markdown content={parseBase64Data(modalData.content)} githubMemberName={modalOpen} />
				{:else}
					<div class="py-8 text-center text-gray-500">No README found.</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
