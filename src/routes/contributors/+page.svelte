<script lang="ts">
	const { data } = $props();
</script>

<div class="mx-auto grid grid-cols-3">
	{#if data.members.length > 0 || data.outsideCollaborators.length > 0}
		{#each data.members as contributor}
			<div class="flex flex-row items-center justify-center">
				<a href={contributor.html_url}>
					<div>
						<img src={contributor.avatar_url} alt="Contributor" />
					</div>
					<div>
						<p>{contributor.login}</p>
					</div>
				</a>
			</div>
		{/each}
	{:else}
		<p class="text-center text-gray-500">No contributors found.</p>
	{/if}
</div>
