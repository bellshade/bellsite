<script lang="ts">
	import { ArrowTopRightOnSquareIcon, ChevronDownIcon } from '@fvilers/heroicons-svelte/16/solid';
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
</script>

<nav
	class="fixed top-6 left-1/2 z-50 flex max-w-[calc(100%-2rem)] min-w-max -translate-x-1/2 justify-center rounded-xl border border-gray-300 bg-white px-4 py-1 shadow-lg md:w-auto"
>
	<div class="flex flex-row items-center justify-evenly gap-4">
		<div class={['shrink-0 rounded-lg p-1', { 'bg-gray-200': page.url.pathname === '/' }]}>
			<a href="/"><img src="/bellshade.png" alt="Bellshade logo" class="size-8 rounded-full" /></a>
		</div>
		<ul class="flex flex-row items-center space-x-4 whitespace-nowrap">
			{#each mainLinks as link}
				<li class="relative">
					<a
						href={link.href}
						class={[
							'rounded-lg px-2 py-1 text-gray-800 hover:text-gray-600',
							{ 'bg-gray-200': link.href === page.url.pathname }
						]}>{link.name}</a
					>
				</li>
			{/each}
			<li class="group/dropdown relative">
				<button class="flex items-center text-gray-600 hover:text-gray-800">
					<span>Lainnya</span>
					<ChevronDownIcon
						class="ml-1 size-4 transition-transform duration-300 group-hover/dropdown:rotate-180"
					/>
				</button>
				<ul
					class="absolute top-full left-0 hidden rounded-md bg-white shadow-lg group-hover/dropdown:block"
				>
					<li class="p-1">
						{#each lainnyaLinks as link}
							<a
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								class="group flex items-center justify-between rounded px-4 py-2 whitespace-nowrap text-gray-800 hover:bg-gray-100"
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
