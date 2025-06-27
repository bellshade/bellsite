<script lang="ts">
	import FileOrFolderNode from './FileOrFolderNode.svelte';
	import { page } from '$app/state';
	import Markdown from '$lib/components/Markdown.svelte';
	import { onMount } from 'svelte';

	const { data } = $props();

	let hasClientLoaded = $state(false);

	onMount(() => {
		hasClientLoaded = true;
	});

	const isMarkdown = $derived.by(() => {
		if (!hasClientLoaded) {
			return false;
		}

		if (page.url.pathname.startsWith('/repos/') && !page.url.searchParams.has('file')) {
			return true;
		}
		const fileName = page.url.searchParams.get('file') ?? '';
		return fileName.endsWith('.md') || fileName.endsWith('.markdown');
	});

	const isImage = $derived.by(() => {
		if (!hasClientLoaded) {
			return false;
		}
		if (page.url.pathname.startsWith('/repos/') && !page.url.searchParams.has('file')) {
			return true;
		}
		const fileName = page.url.searchParams.get('file') ?? '';
		return fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.gif');
	});

	const fileData = $derived.by(async () => {
		if (!hasClientLoaded) {
			return '';
		}

		if (data.repoName && !page.url.searchParams.has('file')) {
			const nameOfReadme = Object.keys(data.contents).find((e) => e.toLowerCase() === 'readme.md');

			const response = await fetch(
				`https://raw.githubusercontent.com/bellshade/${data.repoName}/main/${nameOfReadme}`
			);
			if (!response.ok) {
				throw new Error(`Failed to fetch README: ${response.statusText}`);
			}

			return await response.text();
		}

		if (!data.repoName || !page.url.searchParams.has('file')) {
			throw new Error('Repository name or file parameter is missing');
		}

		const response = await fetch(
			`https://raw.githubusercontent.com/bellshade/${data.repoName}/main/${page.url.searchParams.get('file') ?? ''}`
		);
		if (!response.ok) {
			throw new Error(`Failed to fetch file data: ${response.statusText}`);
		}

		return await response.text();
	});

	const fileExtension = $derived.by(() => {
		if (!hasClientLoaded || !page.url.searchParams.has('file')) {
			return '';
		}

		const fileName = page.url.searchParams.get('file') ?? '';
		return fileName.split('.').pop()?.toLowerCase() || '';
	});
</script>

<div class="mx-auto mt-25 flex max-w-screen-lg gap-x-4 px-4">
	<div class="h-[calc(100vh-8rem)] w-64 rounded-xl border border-gray-300 bg-zinc-100 py-4">
		<div class="h-full w-full overflow-y-auto bg-zinc-100 px-2">
			<div>
				<FileOrFolderNode repoName={data.repoName} node={data.contents} />
			</div>
		</div>
	</div>

	<div class="h-[calc(100vh-8rem)] grow rounded-xl border border-gray-300 p-4">
		{#await fileData}
			<p class="text-center text-gray-500">Loading file content...</p>
		{:then content}
			{#if isImage}
				<img
					src={`https://raw.githubusercontent.com/bellshade/${data.repoName}/main/${page.url.searchParams.get('file') ?? ''}`}
					alt="Path"
				/>
			{:else if isMarkdown}
				<Markdown {content} />
			{:else}
				<Markdown content={`\`\`\`${fileExtension}\n${content}\n\`\`\``} />
			{/if}
		{:catch error}
			<p class="text-red-500">Error loading file: {error.message}</p>
		{/await}
	</div>
</div>
