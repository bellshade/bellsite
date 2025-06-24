<script lang="ts">
	import { ChevronDownIcon } from '@fvilers/heroicons-svelte/16/solid';
	import '../app.css';

	const { children } = $props();

	const mainLinks = [
		{ name: 'Materi', href: '/repos' },
		{ name: 'Proyek Sekarang', href: '/current-projects' },
		{ name: 'Tim Bellshade', href: '/contributors' }
	];

	const lainnyaLinks = [
		{ name: 'WPU Homepage', href: '#' },
		{ name: 'WPU Showcase', href: '#' },
		{ name: 'WPU Identity', href: '#' }
	];
</script>

<nav
	class="fixed top-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 shadow-lg md:w-auto"
>
	<div class="flex flex-row items-center justify-evenly gap-4">
		<div class="shrink-0">
			<a href="/"><img src="./bellshade.png" alt="Bellshade logo" class="size-8" /> </a>
		</div>
		<ul class="flex flex-row items-center space-x-8">
			{#each mainLinks as link}
				<li class="relative">
					<a href={link.href} class="text-gray-800 hover:text-gray-600">{link.name}</a>
				</li>
			{/each}
			<li class="group relative">
				<button class="flex items-center text-gray-600 hover:text-gray-800">
					Lainnya
					<ChevronDownIcon
						class="ml-1 size-4 transition-transform duration-300 group-hover:rotate-180"
					/>
				</button>
				<ul class="absolute top-full left-0 hidden rounded-md bg-white shadow-lg group-hover:block">
					<li>
						{#each lainnyaLinks as link}
							<a
								href={link.href}
								class="block px-4 py-2 whitespace-nowrap text-gray-800 hover:bg-gray-100"
								>{link.name}</a
							>
						{/each}
					</li>
				</ul>
			</li>
		</ul>
	</div>
</nav>

<div class="pt-24"></div>

{@render children()}
