<script lang="ts">
	const { text, className = '', children } = $props();
</script>

<button class="{className} flex gap-2 rounded-lg bg-black px-6 py-3 text-white shadow-lg"
	>{@render children()}{text}</button
>
