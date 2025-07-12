<script lang="ts">
	import { isDarkMode } from '$lib/state/theme.svelte';
	import { MoonIcon, SunIcon } from '@fvilers/heroicons-svelte/16/solid';

	const { className = '' } = $props();
</script>

<button
	aria-label="dark-mode"
	onclick={() => (isDarkMode.toggled = !isDarkMode.toggled)}
	class={['bg-transparent hover:cursor-pointer', className]}
>
	{#if isDarkMode.toggled}
		<SunIcon class="text-gray-300" />
	{:else}
		<MoonIcon />
	{/if}
</button>
