<script lang="ts">
	import {
		ArrowTopRightOnSquareIcon,
		Bars3Icon,
		ChevronDownIcon,
		EnvelopeIcon,
		MapPinIcon
	} from '@fvilers/heroicons-svelte/16/solid';
	import { page } from '$app/state';
	import '../app.css';
	import { isDarkMode } from '$lib/state/theme.svelte';
	import DarkModeButton from '$lib/components/DarkModeButton.svelte';
	import { onMount } from 'svelte';

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
	let hamburgerRef: HTMLElement | null = null;
	// handle close hamburger when clicking anywhere outside the dom
	function handleClickOutside(node: HTMLElement, callback: () => void) {
		function handler(event: MouseEvent) {
			if (!node.contains(event.target as Node)) {
				callback();
			}
		}
		document.addEventListener('click', handler, true);
		return {
			destroy() {
				document.removeEventListener('click', handler, true);
			}
		};
	}

	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.classList.toggle('dark', isDarkMode.toggled);
		}
	});
</script>

<nav
	class="fixed top-6 right-4 z-999 flex max-w-[calc(100%-2rem)] min-w-max justify-center rounded-xl border border-gray-300 bg-white px-4 py-1 shadow-lg sm:right-1/2 sm:translate-x-1/2 md:w-auto dark:border-zinc-800 dark:bg-gray-900 dark:shadow-md dark:shadow-zinc-900"
>
	<div class="flex flex-row items-center justify-evenly gap-4">
		<div class="flex shrink-0 justify-center gap-4 rounded-lg p-1">
			<DarkModeButton className="w-8" />
			<a href="/" class={[{ 'bg-gray-200 dark:bg-gray-800': page.url.pathname === '/' }]}
				><img src="/bellshade.png" alt="Bellshade logo" class="size-8 rounded-full" /></a
			>
		</div>
		<ul class="flex flex-row items-center space-x-4 whitespace-nowrap">
			{#each mainLinks as link (link.href)}
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
				use:handleClickOutside={() => (isHamburgerOpen = false)}
				bind:this={hamburgerRef}
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
					<Bars3Icon class="size-4 sm:hidden dark:text-gray-300" />
					<ChevronDownIcon
						class="ml-1 hidden size-4 transition-transform duration-300 group-hover/dropdown:rotate-180 sm:inline-block dark:text-gray-300"
					/>
				</button>
				<ul
					class={[
						'absolute top-full right-0 mt-3 rounded-md bg-white shadow-lg dark:bg-gray-900',
						{ block: isHamburgerOpen },
						{ hidden: !isHamburgerOpen }
					]}
				>
					<li class="p-1">
						{#each mainLinks as link (link.href)}
							<a
								href={link.href}
								class="block rounded px-4 py-2 text-gray-800 hover:bg-gray-100 sm:hidden dark:text-gray-300 dark:hover:bg-gray-700"
								onclick={() => (isHamburgerOpen = false)}>{link.name}</a
							>
						{/each}
						{#each lainnyaLinks as link (link.href)}
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

<footer class="mx-auto max-w-screen-xl overflow-hidden px-5 xl:px-0">
	<div class="relative mb-8 w-full rounded-2xl bg-[#27272a] p-10">
		<div class="grid grid-cols-1 gap-8 text-white md:grid-cols-2 lg:grid-cols-5">
			<div class="space-y-4 lg:col-span-2">
				<h1 class="text-4xl font-bold">Bellshade</h1>
				<p class="text-muted-foreground max-w-[24rem]">
					Komunitas untuk mengelola dan menulis kode untuk proyek pendidikan sumber terbuka
					Indonesia.
				</p>
				<div class="flex w-fit gap-2">
					<EnvelopeIcon class="size-6 rounded-sm bg-white p-[2px] text-[#27272a]" />
					<a href="mailto:bellshade@proton.me" class="decoration-2 hover:underline"
						>bellshade@proton.me</a
					>
				</div>
				<div class="flex w-fit gap-2">
					<MapPinIcon class="size-6 rounded-sm bg-white p-[2px] text-[#27272a]" />
					<span>Indonesia</span>
				</div>
			</div>
			<div class="space-y-4">
				<h3 class="text-lg font-semibold">Tautan Halaman</h3>
				<nav class="flex w-fit flex-col space-y-2 text-base">
					<a href="/repos" class="hover:underline"> Materi </a>
					<a href="/current-projects" class="hover:underline"> Proyek </a>
					<a href="/contributors" class="hover:underline"> Tim Bellshade </a>
				</nav>
			</div>
		</div>
		<img
			src="/wpuputih.png"
			alt="bellshade logo"
			class="absolute -right-90 -bottom-80 h-auto w-[600px]"
		/>
	</div>
</footer>
