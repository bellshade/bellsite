<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	let visible = $state(false);
	let isTypewriterBlinking = $state(false);

	function typewriter(node: HTMLHeadingElement, { speed = 1 }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent;
		const duration = text!.length / (speed * 0.01);

		return {
			duration,
			tick: (t: number) => {
				const i = Math.trunc(text!.length * t);
				node.textContent = text!.slice(0, i);
			}
		};
	}

	$effect(() => {
		setTimeout(() => {
			visible = true;
		}, 500);
	});
</script>

<div class="relative h-100 overflow-hidden">
	<img src="/cover.png" alt="Bellshade Logo" class="absolute size-full object-cover" />
	<div class="absolute h-full w-full bg-gradient-to-b from-transparent to-white"></div>
	<div
		class="absolute right-0 bottom-0 size-100 translate-1/2 rounded-full bg-white blur-3xl"
	></div>
	<div
		class="absolute bottom-0 left-0 size-100 -translate-x-1/2 translate-y-1/2 rounded-full bg-white blur-3xl"
	></div>
</div>

<section class="-translate-y-20">
	<div class="mx-auto max-w-2xl px-4">
		<div class="mb-8 flex h-28 items-center justify-center gap-1">
			{#if visible}
				<h1
					class="text-center text-8xl text-gray-900"
					transition:typewriter={{ speed: 0.75 }}
					onintroend={() => (isTypewriterBlinking = true)}
				>
					Bellshade.
				</h1>
			{/if}
			<span class={['block h-24 w-1 bg-gray-900', { 'animate-blink': isTypewriterBlinking }]}
			></span>
		</div>
		<div class="w-full border-y border-gray-300 py-8">
			<h3 class="pb-8 text-xl font-bold">Apa itu Bellshade?</h3>
			<p class="mt-2 text-justify text-gray-600">
				Bellshade adalah organisasi yang bergerak di bidang edukasi dan bersifat sumber terbuka
				(open source). Bellshade dikelola dan berada di bawah naungan komunitas
				<a href="https://discord.gg/wpu" class="text-black hover:underline">
					Web Programming UNPAS (WPU).
				</a>
				Nama Bellshade sendiri diambil dari Bahasa Inggris yang berarti "penutup lampu belajar", yang
				mengarahkan cahaya dari lampu agar fokus pada tujuan dan tepat sasaran. Dengan nama ini, Bellshade
				diharapkan dapat menjadi wadah untuk menerangi dan mengarahkan serta memberikan ilmu kepada orang
				yang membutuhkan, terutama di bidang teknologi.
			</p>
		</div>
		<div class="flex w-full justify-center py-8">
			<a href="https://github.com/bellshade">
				<Button text="Bellshade" className="font-semibold">
					<svg
						height="20"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
					>
						<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							<g
								id="Dribbble-Light-Preview"
								transform="translate(-140.000000, -7559.000000)"
								fill="#ffffff"
							>
								<g id="icons" transform="translate(56.000000, 160.000000)">
									<path
										d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
										id="github-[#142]"
									>
									</path>
								</g>
							</g>
						</g>
					</svg>
				</Button>
			</a>
		</div>
	</div>
</section>
