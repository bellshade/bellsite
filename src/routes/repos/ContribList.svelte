<script lang="ts">
    import type { Contributor } from "./+page.server";
    const { contributors }: { contributors: Contributor[] } = $props();

    let hover = $state(false);

    function onMouseEnter() {
        console.log("Enter");
        hover = true;
    }

    function onMouseLeave() {
        console.log("Leave");
        hover = false;
    }
</script>
<div onmouseenter={onMouseEnter} onmouseleave={onMouseLeave} role="img">
    {#each contributors as contrib, index}
        <a href={contrib.html_url} style:translate={hover ? "0px 0px" : `${index * -6}px 0px`} class="inline-block duration-100">
            <img src={contrib.avatar_url ?? ''} alt={contrib.login} class="size-5 rounded-full" />
        </a>
    {/each}
</div>
