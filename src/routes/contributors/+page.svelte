<script lang="ts">
	import type { GithubMember } from './+page.server';
	type GitHubFileResponse = {
		content?: string;
	};
	const { data } = $props();
	let modalOpen = $state(false);
	let modalData = $state<GitHubFileResponse | string>('');
	let loading = $state(false);

	async function handleOpenModal(e: MouseEvent, contributor: GithubMember) {
		e.preventDefault();
		modalOpen = true;
		loading = true;

		try {
			const response = await fetch(
				`https://api.github.com/repos/${contributor.login}/${contributor.login}/contents/README.md`
			);
			modalData = await response.json();
			loading = false;
		} catch (err) {
			modalData = `Error fetching data: ${(err as unknown as Error).message}`;
		}
	}

	function closeModal() {
		modalOpen = false;
		modalData = '';
		loading = false;
	}
</script>

<div class="mx-auto grid max-w-screen-xl grid-cols-1 py-24 md:grid-cols-3">
	<h1 class="col-span-full py-10 text-center text-3xl">Kenalan yuk sama Team Bellshade!</h1>
	{#if data.members.length > 0 || data.outsideCollaborators.length > 0}
		{#each [...data.members, ...data.outsideCollaborators] as contributor}
			<div class="flex flex-row items-center justify-center">
				<a
					onclick={(e) => handleOpenModal(e, contributor)}
					href="/"
					class="group my-8 flex h-40 w-75 items-center rounded-lg border border-gray-300 p-8 transition-all hover:rotate-2 hover:bg-gray-100 md:h-50 md:w-100"
				>
					<div class="flex items-center gap-4">
						<img
							src={contributor.avatar_url}
							alt="Contributor"
							class="w-18 rounded-full transition-transform group-hover:scale-105 md:w-25"
						/>
						<p class="text-md md:text-lg">{contributor.login}</p>
					</div>
				</a>
			</div>
		{/each}
	{:else}
		<p class="text-center text-gray-500">No contributors found.</p>
	{/if}
</div>

{#if modalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
		<div class="relative max-h-200 max-w-250 rounded-lg bg-white p-6 shadow-lg">
			<button
				class="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-gray-600"
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
				<div class="prose max-h-180 min-w-120 overflow-auto py-4">
					<pre>{atob(modalData.content)}</pre>
				</div>
			{:else}
				<div class="py-8 text-center text-gray-500">No README found.</div>
			{/if}
		</div>
	</div>
{/if}
