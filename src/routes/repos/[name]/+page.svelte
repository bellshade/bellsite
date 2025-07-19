<script lang="ts">
	import FileOrFolderNode from './FileOrFolderNode.svelte';

	import { page } from '$app/state';
	import Markdown from '$lib/components/Markdown.svelte';
	import { resolve } from '$lib';

	import { onMount } from 'svelte';
	import { ChevronDownIcon } from '@fvilers/heroicons-svelte/24/outline';
	import { isDarkMode } from '$lib/state/theme.svelte';

	const { data } = $props();

	let hasClientLoaded = $state(false);
	let isSidebarCollapsed = $state(false);

	onMount(() => {
		hasClientLoaded = true;
	});

	const getFileType = (name: string) => {
		switch (true) {
			case name.endsWith('.md'):
			case name.endsWith('.MD'):
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

	const linkResolver = (base: string, path: string) => {
		if (path.startsWith('http')) {
			return path;
		}

		const resolvedPath = resolve(base, "..", path);

		let currentObject = data.contents;
		const parts = resolvedPath.split('/');
		const end = parts.pop() || "";

		if (parts[0] === '') {
			parts.shift();
		}

		for (const part of parts) {
			if (currentObject[part]) {
				currentObject = currentObject[part];
			} else {
				return `?file=${resolvedPath}`;
			}
		}

		const [lastPart, ...idParts] = end.split('#');

		const finalPath = parts.join("/") + (parts.length > 0 && lastPart ? '/' : '') + lastPart;
		const id = idParts.length > 0 ? `#${idParts.join('#')}` : "";

		return currentObject[lastPart] === null ? `?file=${finalPath}${id}` : `?file=${resolve(finalPath, "README.md")}${id}`;
	}

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
</script>

<svelte:head>
	<title>Bellshade - Materi - {data.repoName}</title>
</svelte:head>

<div class="mx-auto mt-25 flex max-w-screen-lg flex-col gap-x-4 px-4 md:flex-row">
	<div
		class={[
			'relative mb-4 w-full rounded-xl border border-gray-300 bg-zinc-100 transition-all md:h-[calc(100vh-8rem)] md:w-64 md:py-4 dark:border-zinc-700 dark:bg-gray-700',
			{ 'h-0 py-4': isSidebarCollapsed },
			{ 'h-[50vh] py-8': !isSidebarCollapsed }
		]}
	>
		<button
			class="absolute top-0 left-0 block w-full p-2 md:hidden"
			onclick={() => (isSidebarCollapsed = !isSidebarCollapsed)}
		>
			<ChevronDownIcon
				class={[
					'size-4 duration-100',
					{ '-rotate-90': isSidebarCollapsed, 'text-gray-300': isDarkMode.toggled }
				]}
			/>
		</button>
		<div class="h-full w-full overflow-y-auto bg-zinc-100 px-2 transition-all dark:bg-gray-700">
			<div class="dark:text-gray-50">
				<FileOrFolderNode repoName={data.repoName} node={data.contents} />
			</div>
		</div>
	</div>

	<div
		class="mb-4 h-[calc(100vh-8rem)] grow rounded-xl border border-gray-300 p-4 dark:border-zinc-700"
	>
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
					imageResolver={(path) =>
						path.startsWith('http')
							? path
							: new URL(
									path,
									`https://raw.githubusercontent.com/bellshade/${data.repoName}/main/${meta.path}`
								).toString()}
					linkResolver={(path) => linkResolver(meta.path, path)}
				/>
			{:else}
				<Markdown content={`\`\`\`${meta.extension}\n${meta.content}\n\`\`\``} />
			{/if}
		{:catch error}
			<p class="text-red-500">Error loading file: {error.message}</p>
		{/await}
	</div>
</div>
