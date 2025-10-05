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

<footer class="bg-gradient-to-b from-gray-900 to-black text-white">
	<div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-lg text-center">
			<img src="/bellshade.png" class="mx-auto h-12" alt="Bellshade Logo" />
			<p class="mt-4 text-gray-400">
				Komunitas untuk mengelola dan menulis kode untuk proyek pendidikan sumber terbuka Indonesia.
			</p>
		</div>

		<div class="mt-8 mb-12 flex justify-center space-x-6">
			<a
				href="https://github.com/bellshade"
				target="_blank"
				rel="noopener noreferrer"
				class="text-gray-400 transition duration-300 hover:scale-110 hover:text-white"
			>
				<span class="sr-only">GitHub</span>
				<svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						fill-rule="evenodd"
						d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"
						clip-rule="evenodd"
					/>
				</svg>
			</a>
			<a
				href="https://discord.gg/wpu"
				target="_blank"
				rel="noopener noreferrer"
				class="text-gray-400 transition duration-300 hover:scale-110 hover:text-white"
			>
				<span class="sr-only">Discord</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						d="M20.317 4.488c-1.62-.9-3.535-1.42-5.53-1.652a.35.35 0 00-.38.352c.02.18.14.3.32.351 1.82.21 3.57.68 5.1 1.49a.35.35 0 00.43-.32c.02-.2-.1-.37-.34-.22zM8.63 15.21c-1.01 0-1.83-.82-1.83-1.83s.82-1.83 1.83-1.83 1.83.82 1.83 1.83-.82 1.83-1.83 1.83zm6.74 0c-1.01 0-1.83-.82-1.83-1.83s.82-1.83 1.83-1.83 1.83.82 1.83 1.83-.82 1.83-1.83 1.83z"
					/>
					<path
						d="M21.83 3.747a.35.35 0 00-.45-.22c-2.2.98-4.2 1.7-6.3 2.1-1.2-.4-2.5-.6-3.8-.6s-2.6.2-3.8.6c-2.1-.4-4.1-1.12-6.3-2.1a.35.35 0 00-.45.22c-1.4 3.6-1.8 7.4-1.1 11.1a.35.35 0 00.35.35c.2 0 .3-.1.35-.3 1.2-2.1 2.8-3.8 4.7-5.2a.35.35 0 00-.1-.55c-.2-.1-.4 0-.5.2-2.1 1.5-3.8 3.4-5.1 5.6a.35.35 0 00.35.45c3.1.9 6.4 1.1 9.6 0a.35.35 0 00.35-.45c-1.3-2.2-3-4.1-5.1-5.6a.35.35 0 00-.5-.2c-.2.1-.3.3-.1.55 1.9 1.4 3.5 3.1 4.7 5.2.05.2.15.3.35.3a.35.35 0 00.35-.35c.7-3.7.3-7.5-1.1-11.1z"
					/>
				</svg>
			</a>
		</div>

		<div
			class="grid grid-cols-1 gap-8 border-t border-gray-800 pt-12 sm:grid-cols-2 lg:grid-cols-4"
		>
			<div class="text-center sm:text-left">
				<p class="font-medium">Tautan Halaman</p>
				<ul class="mt-6 space-y-4 text-sm">
					<li><a href="/repos" class="text-gray-400 transition hover:text-white">Materi</a></li>
					<li>
						<a href="/current-projects" class="text-gray-400 transition hover:text-white">Proyek</a>
					</li>
					<li>
						<a href="/contributors" class="text-gray-400 transition hover:text-white"
							>Tim Bellshade</a
						>
					</li>
				</ul>
			</div>
			<div class="text-center sm:text-left">
				<p class="font-medium">Komunitas WPU</p>
				<ul class="mt-6 space-y-4 text-sm">
					<li>
						<a
							href="https://wpushowcase.id"
							target="_blank"
							rel="noopener noreferrer"
							class="text-gray-400 transition hover:text-white">WPU Showcase</a
						>
					</li>
					<li>
						<a
							href="https://wpu.my.id"
							target="_blank"
							rel="noopener noreferrer"
							class="text-gray-400 transition hover:text-white">WPU Identity</a
						>
					</li>
					<li>
						<a
							href="https://wpucourse.id"
							target="_blank"
							rel="noopener noreferrer"
							class="text-gray-400 transition hover:text-white">WPU Course</a
						>
					</li>
					<li>
						<a
							href="https://wpustore.id"
							target="_blank"
							rel="noopener noreferrer"
							class="text-gray-400 transition hover:text-white">WPU Store</a
						>
					</li>
				</ul>
			</div>
			<div class="text-center sm:text-left">
				<p class="font-medium">Kontak</p>
				<ul class="mt-6 space-y-4 text-sm">
					<li>
						<a
							href="mailto:bellshade@proton.me"
							class="flex items-center justify-center gap-2 text-gray-400 transition hover:text-white sm:justify-start"
						>
							<EnvelopeIcon class="h-5 w-5" />
							<span>bellshade@proton.me</span>
						</a>
					</li>
					<li class="flex items-center justify-center gap-2 text-gray-400 sm:justify-start">
						<MapPinIcon class="h-5 w-5" />
						<span>Indonesia</span>
					</li>
				</ul>
			</div>
			<div class="text-center sm:text-left">
				<p class="font-medium">Gabung Kontribusi</p>
				<div class="mt-6">
					<a
						href="https://github.com/bellshade/bellshade/blob/main/CONTRIBUTING.md"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:ring focus:ring-blue-400 focus:outline-none"
					>
						Mulai Berkontribusi
					</a>
				</div>
			</div>
		</div>

		<div class="mt-12 border-t border-gray-800 pt-8 sm:flex sm:items-center sm:justify-between">
			<p class="text-center text-sm text-gray-400 sm:text-left">
				&copy; {new Date().getFullYear()} Bellshade. Dibuat dengan ❤️ oleh Tim Bellshade.
			</p>
			<a
				href="https://wpu.my.id"
				target="_blank"
				rel="noopener noreferrer"
				class="mt-4 flex justify-center sm:mt-0 sm:justify-start"
			>
				<span class="sr-only">WPU</span>
				<img
					src="/wpuputih.png"
					alt="WPU Logo"
					class="h-8 opacity-60 transition hover:opacity-100"
				/>
			</a>
		</div>
	</div>
</footer>
