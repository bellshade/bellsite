<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = {
		text?: string;
		className?: string;
		children?: Snippet;
	};
	const { text = '', className = '', children }: Props = $props();
</script>

<button
	class="{className} flex cursor-pointer gap-2 rounded-lg border-4 border-gray-200 bg-black px-6 py-3 text-white transition-transform hover:rotate-2 hover:border-gray-300 dark:border-gray-900 dark:bg-gray-50 dark:text-black hover:dark:border-gray-700"
	>{@render children?.()}{text}</button
>
