<script lang="ts">
	import {
		ArrowTopRightOnSquareIcon,
		Bars3Icon,
		ChevronDownIcon
	} from '@fvilers/heroicons-svelte/16/solid';
	import { page } from '$app/state';
	import '../app.css';
	import { isDarkMode } from '$lib/state/theme.svelte';
	import DarkModeButton from '$lib/components/DarkModeButton.svelte';

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

	$effect(() => {
		if (typeof document !== undefined) {
			document.documentElement.classList.toggle('dark', isDarkMode.toggled);
		}
	});
</script>

<nav
	class="fixed top-6 left-1/2 z-50 flex max-w-[calc(100%-2rem)] min-w-max -translate-x-1/2 justify-center rounded-xl border border-gray-300 bg-white px-4 py-1 shadow-lg md:w-auto dark:border-zinc-800 dark:bg-gray-900"
>
	<div class="flex flex-row items-center justify-evenly gap-4">
		<div class="flex shrink-0 justify-center gap-4 rounded-lg p-1">
			<DarkModeButton className="w-8" />
			<a href="/" class={[{ 'bg-gray-200 dark:bg-gray-800': page.url.pathname === '/' }]}
				><img src="/bellshade.png" alt="Bellshade logo" class="size-8 rounded-full" /></a
			>
		</div>
		<ul class="flex flex-row items-center space-x-4 whitespace-nowrap">
			{#each mainLinks as link}
				<li class="relative hidden sm:block">
					<a
						href={link.href}
						class={[
							'rounded-lg px-2 py-1 text-gray-800 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400',
							{ 'bg-gray-200 dark:bg-gray-800': link.href === page.url.pathname }
						]}>{link.name}</a
					>
				</li>
			{/each}
			<li
				class={[
					'group/dropdown relative rounded-lg px-2 py-1',
					{ 'bg-gray-200 dark:bg-gray-900': isHamburgerOpen }
				]}
			>
				<button
					onclick={() => (isHamburgerOpen = !isHamburgerOpen)}
					class="flex min-h-6 cursor-pointer items-center text-gray-600 hover:text-gray-800"
				>
					<span class="hidden sm:inline dark:text-gray-300">Lainnya</span>
					<Bars3Icon class="size-4 sm:hidden" />
					<ChevronDownIcon
						class="ml-1 hidden size-4 transition-transform duration-300 group-hover/dropdown:rotate-180 sm:inline-block"
					/>
				</button>
				<ul
					class={[
						'absolute top-full -left-25 rounded-md bg-white shadow-lg group-hover/dropdown:block sm:-left-10 dark:bg-gray-900',
						{ block: isHamburgerOpen },
						{ hidden: !isHamburgerOpen }
					]}
				>
					<li class="p-1">
						{#each mainLinks as link}
							<a
								href={link.href}
								class="block rounded px-4 py-2 text-gray-800 hover:bg-gray-100 sm:hidden dark:text-gray-300 dark:hover:bg-gray-700"
								onclick={() => (isHamburgerOpen = false)}>{link.name}</a
							>
						{/each}
						{#each lainnyaLinks as link}
							<a
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								class="group flex items-center justify-between rounded px-4 py-2 whitespace-nowrap text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
								onclick={() => (isHamburgerOpen = false)}
							>
								<span>{link.name}</span>
								<ArrowTopRightOnSquareIcon
									class="ml-2 inline-block size-4 text-gray-400 transition-colors duration-300 group-hover:text-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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
