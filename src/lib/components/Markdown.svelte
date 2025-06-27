<script lang="ts">
	import { Marked } from 'marked';
	import { markedHighlight } from 'marked-highlight';
	import DOMPurify from 'dompurify';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.min.css';

	const { content, linkResolver, imageResolver }: { content: string; linkResolver?: (link: string) => string; imageResolver?: (link: string) => string } = $props();

	const marked = new Marked(
		markedHighlight({
			async: false,
			highlight: (code, lang, info) => {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext';
				return hljs.highlight(code, { language }).value;
			}
		})
	);

	const parseAttributes = (token: string) => {
		return Object.fromEntries([...token.matchAll(/([a-zA-Z0-9_-]+)="([^"]*)"/g)].map((v) => [v[1], v[2]]))
	}

	const buildAttributes = (attributes: Record<string, string>) => {
		return Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ');
	}

	marked.use({
		renderer: {
			link: (token) => {
				if (token.text.startsWith("![")) return false;

				const link = linkResolver?.(token.href) ?? token.href;
				return `<a href="${link}">${token.text}</a>`;
			},
			image: ({ href, title, text, tokens }) => {
				href = imageResolver?.(href) ?? href;
				return `<img src="${href}" alt="${text}" title="${title}" />`;
			},
			html: token => {
				if (token.block) {
					const div = document.createElement('div');
					div.innerHTML = token.raw;

					const imgs = div.querySelectorAll('img');
					imgs.forEach(img => {
						const src = img.getAttribute('src');
						if (src) {
							img.setAttribute('src', imageResolver?.(src) ?? src);
						}
					});

					const links = div.querySelectorAll('a');
					links.forEach(link => {
	  					const href = link.getAttribute('href');
						if (href) {
		  					link.setAttribute('href', linkResolver?.(href) ?? href);
						}
	 				});

					token.raw = div.innerHTML;
				}

				// Chunks
				if (/^<a/.test(token.raw)) {
					const attributes = parseAttributes(token.raw);
					
					if ('href' in attributes)
						attributes.href = linkResolver?.(attributes.href) ?? attributes.href;

					return `<a ${buildAttributes(attributes)}>`;
				}

				if (/^<img/.test(token.raw)) {
	 				const attributes = parseAttributes(token.raw);

	 				if ('src' in attributes)
						attributes.src = imageResolver?.(attributes.src) ?? attributes.src;

	 				return `<img ${buildAttributes(attributes)}>`;
				}
				
				return token.raw;
			}
		}
	});

	const htmlContent = DOMPurify.sanitize(
		marked.parse(content, {
			gfm: true,
			async: false
		})
	);
</script>

<div
	class="prose prose-hr:border-2 prose-hr:my-8 prose-hr:border-zinc-300 prose-headings:border-b prose-headings:border-gray-300 prose-li:my-0 prose-headings:pb-2 prose-headings:my-2 prose-img:inline-block prose-img:my-0.5 prose-p: h-full w-full overflow-auto rounded-lg p-4"
>
	{@html htmlContent}
</div>
