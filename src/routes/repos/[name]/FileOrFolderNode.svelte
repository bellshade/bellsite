<script lang="ts">
	import { DocumentIcon, FolderIcon } from '@fvilers/heroicons-svelte/16/solid';
	import { FolderOpenIcon } from '@fvilers/heroicons-svelte/24/outline';
	import type { MappedTree } from './+page.server';
	import FileOrFolderNode from './FileOrFolderNode.svelte';
	import { goto } from '$app/navigation';

	const {
		repoName,
		node,
		path = []
	}: { repoName: string; node: MappedTree; path?: string[] } = $props();

	let keyToIsOpen: Record<string, boolean> = $state({});
</script>

{#each Object.keys(node).sort((a, b) => {
	const aIsFolder = node[a] !== null;
	const bIsFolder = node[b] !== null;

	if (aIsFolder && !bIsFolder) return -1; // Folders first
	if (!aIsFolder && bIsFolder) return 1; // Files last

	return a.localeCompare(b);
}) as key (key)}
	{@const isFolder = node[key] !== null}
	<div style="padding-left: {path.length * 1}rem" class="text-sm dark:bg-gray-700">
		<button
			onclick={() => {
				if (isFolder) {
					keyToIsOpen[key] = !keyToIsOpen[key];
				} else {
					const fullPath = [...path, key].join('/');

					goto(`/repos/${repoName}?file=${fullPath}`, {
						replaceState: true,
						noScroll: true
					});
				}
			}}
			class="flex min-w-full items-center gap-1 rounded-lg p-2 hover:bg-zinc-200 dark:hover:bg-gray-600"
		>
			{#if isFolder}
				{#if keyToIsOpen[key]}
					<FolderOpenIcon class="size-4 shrink-0" />
				{:else}
					<FolderIcon class="size-4 shrink-0" />
				{/if}
			{:else}
				<DocumentIcon class="size-4 shrink-0" />
			{/if}
			<span>{key}</span>
		</button>
	</div>

	{#if isFolder && keyToIsOpen[key]}
		<FileOrFolderNode {repoName} node={node[key]!} path={[...path, key]} />
	{/if}
{/each}
