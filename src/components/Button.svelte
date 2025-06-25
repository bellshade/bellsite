<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = {
		text?: string;
		className?: string;
		children?: Snippet;
	};
	const { text = '', className = '', children }: Props = $props();
</script>

<button class="{className} flex gap-2 rounded-lg bg-black px-6 py-3 text-white shadow-lg"
	>{@render children?.()}{text}</button
>
