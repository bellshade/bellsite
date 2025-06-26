<script lang="ts">
	import { marked } from "marked";
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

		return new TextDecoder("utf-8").decode(byteArray);
	}

	function mdToHtml(md: string) {
		marked.use(
			{
				renderer: {
					image({ href, title, text, tokens }) {
						console.log([href, title, text, tokens]);
						if (href.startsWith(".")) {
							href = new URL(href, `https://raw.githubusercontent.com/${modalOpen}/${modalOpen}/refs/heads/main/`).toString();
						}

						return `<img src="${href}" alt="${text}" title="${title}" width="100%" />`;
					}
				}
			}
		);

		return marked.parse(md, {
			gfm: true
		});
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

{#if modalOpen != null}
	<div class="fixed inset-0 z-50 max-w-full w-full flex justify-center">
		<div class="w-full h-full bg-black opacity-50" onclick={closeModal}></div>
		<div class="absolute max-h-screen h-full flex items-center">
			<div class="relative rounded-lg bg-white p-8 shadow-lg">
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
					<div class="prose w-[calc(100vw-8rem)] h-[calc(100vh-8rem)] overflow-auto border border-black rounded p-4">
						{@html mdToHtml(parseBase64Data(modalData.content))}
					</div>
				{:else}
					<div class="py-8 text-center text-gray-500">No README found.</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
