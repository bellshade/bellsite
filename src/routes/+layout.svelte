<script lang="ts">
	import {
		ArrowTopRightOnSquareIcon,
		Bars3Icon,
		ChevronDownIcon
	} from '@fvilers/heroicons-svelte/16/solid';
	import { page } from '$app/state';
	import '../app.css';

	const { children } = $props();

	const mainLinks = [
		{ name: 'Materi', href: '/repos' },
		{ name: 'Proyek Sekarang', href: '/current-projects' },
		{ name: 'Tim Bellshade', href: '/contributors' }
	];

	const lainnyaLinks = [
		{ name: 'WPU Showcase', href: 'https://wpushowcase.id' },
		{ name: 'WPU Identity', href: 'https://wpu.my.id' },
		{ name: 'WPU Course', href: 'https://wpucourse.id' },
		{ name: 'WPU Store', href: 'https://wpustore.id' }
	];

	let isHamburgerOpen = $state(false);
</script>

<nav
	class="fixed top-6 right-4 z-50 flex justify-center rounded-xl border border-gray-300 bg-white px-4 py-1 shadow-lg md:w-auto sm:right-1/2 sm:translate-x-1/2 max-w-[calc(100%-2rem)] min-w-max"
>
	<div class="flex flex-row items-center justify-evenly gap-4">
		<div class={['shrink-0 rounded-lg p-1', { 'bg-gray-200': page.url.pathname === '/' }]}>
			<a href="/"><img src="/bellshade.png" alt="Bellshade logo" class="size-8 rounded-full" /></a>
		</div>
		<ul class="flex flex-row items-center space-x-4 whitespace-nowrap">
			{#each mainLinks as link}
				<li class="relative hidden sm:block">
					<a
						href={link.href}
						class={[
							'rounded-lg px-2 py-1 text-gray-800 hover:text-gray-600',
							{ 'bg-gray-200': link.href === page.url.pathname }
						]}>{link.name}</a
					>
				</li>
			{/each}
			<li
				class={['group/dropdown rounded-lg px-2 py-1', { 'bg-gray-200': isHamburgerOpen }]}
			>
				<button
					onclick={() => (isHamburgerOpen = !isHamburgerOpen)}
					class="flex min-h-6 cursor-pointer items-center text-gray-600 hover:text-gray-800"
				>
					<span class="hidden sm:inline">Lainnya</span>
					<Bars3Icon class="size-4 sm:hidden" />
					<ChevronDownIcon
						class="ml-1 hidden size-4 transition-transform duration-300 group-hover/dropdown:rotate-180 sm:inline-block"
					/>
				</button>
				<ul
					class={[
						'absolute mt-3 right-0 top-full rounded-md bg-white shadow-lg',
						{ block: isHamburgerOpen },
						{ hidden: !isHamburgerOpen }
					]}
				>
					<li class="p-1">
						{#each mainLinks as link}
							<a
								href={link.href}
								class="block rounded px-4 py-2 text-gray-800 hover:bg-gray-100 sm:hidden"
								onclick={() => (isHamburgerOpen = false)}>{link.name}</a
							>
						{/each}
						{#each lainnyaLinks as link}
							<a
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								class="group flex items-center justify-between rounded px-4 py-2 whitespace-nowrap text-gray-800 hover:bg-gray-100"
								onclick={() => (isHamburgerOpen = false)}
							>
								<span>{link.name}</span>
								<ArrowTopRightOnSquareIcon
									class="ml-2 inline-block size-4 text-gray-400 transition-colors duration-300 group-hover:text-gray-600"
								/>
							</a>
						{/each}
					</li>
				</ul>
			</li>
		</ul>
	</div>
</nav>

{@render children()}
