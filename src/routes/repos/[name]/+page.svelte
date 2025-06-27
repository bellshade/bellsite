<script lang="ts">
	import FileOrFolderNode from './FileOrFolderNode.svelte';

	import { page } from '$app/state';
	import Markdown from '$lib/components/Markdown.svelte';
	import { resolve } from '$lib';

	import { onMount } from 'svelte';
	import { ChevronDownIcon } from '@fvilers/heroicons-svelte/24/outline';

	const { data } = $props();

	let hasClientLoaded = $state(false);
	let isSidebarCollapsed = $state(false);

	onMount(() => {
		hasClientLoaded = true;
	});

	const getFileType = (name: string) => {
		switch (true) {
			case name.endsWith('.md'):
			case name.endsWith('.markdown'):
				return 'markdown';

			case name.endsWith('.png'):
			case name.endsWith('.jpg'):
			case name.endsWith('.gif'):
				return 'image';

			default:
				return 'text';
		}
	};

	const metadata = $derived.by(async () => {
		if (!hasClientLoaded) {
			return null;
		}

		if (page.url.pathname.startsWith('/repos/') && !page.url.searchParams.has('file')) {
			if (!data.repoName) {
				return null;
			}

			const nameOfReadme = Object.keys(data.contents).find((e) => e.toLowerCase() === 'readme.md');
			const response = await fetch(
				`https://raw.githubusercontent.com/bellshade/${data.repoName}/main/${nameOfReadme}`
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch README: ${response.statusText}`);
			}

			return {
				type: 'markdown',
				content: await response.text(),
				extension: 'md',
				path: nameOfReadme!
			} as const;
		}

		// Get readme files
		const fileName = page.url.searchParams.get('file') ?? '';
		const response = await fetch(
			`https://raw.githubusercontent.com/bellshade/${data.repoName}/main/${page.url.searchParams.get('file') ?? ''}`
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch file data: ${response.statusText}`);
		}

		return {
			type: getFileType(fileName),
			content: await response.text(),
			extension: fileName.split('.').pop()?.toLowerCase() || '',
			path: fileName
		} as const;
	});

	function handleCollapseSidebar() {
		isSidebarCollapsed = !isSidebarCollapsed;
	}
</script>

<div class="mx-auto mt-25 flex max-w-screen-lg flex-col gap-x-4 px-4 md:flex-row">
	<div
		class={`relative mb-4 ${isSidebarCollapsed ? 'h-0 py-4' : 'h-[50vh] py-8'} w-full rounded-xl border border-gray-300 bg-zinc-100 transition-all md:h-[calc(100vh-8rem)] md:w-64 md:py-4`}
	>
		<button
			class="absolute top-0 left-0 block w-full p-2 md:hidden"
			onclick={handleCollapseSidebar}
		>
			<ChevronDownIcon class={['size-4 duration-100', { '-rotate-90': isSidebarCollapsed }]} />
		</button>
		<div class="h-full w-full overflow-y-auto bg-zinc-100 px-2 transition-all">
			<div>
				<FileOrFolderNode repoName={data.repoName} node={data.contents} />
			</div>
		</div>
	</div>

	<div class="mb-4 h-[calc(100vh-8rem)] grow rounded-xl border border-gray-300 p-4">
		{#await metadata}
			<p class="text-center text-gray-500">Loading file content...</p>
		{:then meta}
			{#if !meta}
				<div>Hello World! :D</div>
			{:else if meta.type === 'image'}
				<img
					src={`https://raw.githubusercontent.com/bellshade/${data.repoName}/main/${page.url.searchParams.get('file') ?? ''}`}
					alt="Path"
				/>
			{:else if meta.type === 'markdown'}
				<Markdown
					content={meta.content}
					imageResolver={path => path.startsWith(".") ? new URL(path, `https://raw.githubusercontent.com/bellshade/${data.repoName}/main/`).toString() : path}
	 				linkResolver={path => path.startsWith("http") ? path : "?file=" + resolve(meta.path, "..", path, "README.md")}
				/>
			{:else}
				<Markdown content={`\`\`\`${meta.extension}\n${meta.content}\n\`\`\``} />
			{/if}
		{:catch error}
			<p class="text-red-500">Error loading file: {error.message}</p>
		{/await}
	</div>
</div>
