<script lang="ts">
	import { isDarkMode } from '$lib/state/theme.svelte';
	import { MoonIcon } from '@fvilers/heroicons-svelte/16/solid';

	const { className = '' } = $props();
</script>

<button
	aria-label="dark-mode"
	onclick={() => (isDarkMode.toggled = !isDarkMode.toggled)}
	class={['bg-transparent hover:cursor-pointer', className]}
>
	<MoonIcon class={[{ 'text-gray-300': isDarkMode.toggled }]}></MoonIcon>
</button>
