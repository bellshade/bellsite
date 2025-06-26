<script lang="ts">
	import FileOrFolderNode from './FileOrFolderNode.svelte';
	import { page } from '$app/state';
	import Markdown from '$lib/components/Markdown.svelte';

	const { data } = $props();

	const isMarkdown = $derived.by(() => {
		const fileName = page.url.searchParams.get('file') ?? '';
		return fileName.endsWith('.md') || fileName.endsWith('.markdown');
	});

	const fileData = $derived.by(async () => {
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
		const fileName = page.url.searchParams.get('file') ?? '';
		return fileName.split('.').pop()?.toLowerCase() || '';
	});
</script>

<div class="mx-auto mt-25 flex max-w-screen-xl gap-x-4 px-4">
	<div class="w-64 rounded-xl border border-gray-300 bg-zinc-100 p-4">
		<div class="overflow-x-auto">
			<FileOrFolderNode repoName={data.repoName} node={data.contents} />
		</div>
	</div>

	<div class="grow rounded-xl border border-gray-300 p-4">
		{#await fileData}
			<p class="text-center text-gray-500">Loading file content...</p>
		{:then content}
			{#if isMarkdown}
				<Markdown {content} />
			{:else}
				<Markdown content={`\`\`\`${fileExtension}\n${content}\n\`\`\``} />
			{/if}
		{:catch error}
			<p class="text-red-500">Error loading file: {error.message}</p>
		{/await}
	</div>
</div>
