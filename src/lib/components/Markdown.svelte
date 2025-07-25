<script lang="ts">
	import { Marked } from 'marked';
	import { markedHighlight } from 'marked-highlight';
	import DOMPurify from 'dompurify';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.min.css';

	const {
		content,
		linkResolver,
		imageResolver,
		className
	}: {
		content: string;
		linkResolver?: (link: string) => string;
		imageResolver?: (link: string) => string;
		className?: string;
	} = $props();

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
		return Object.fromEntries(
			[...token.matchAll(/([a-zA-Z0-9_-]+)="([^"]*)"/g)].map((v) => [v[1], v[2]])
		);
	};

	const buildAttributes = (attributes: Record<string, string>) => {
		return Object.entries(attributes)
			.map(([key, value]) => `${key}="${value}"`)
			.join(' ');
	};

	marked.use({
		walkTokens: (token) => {
			if (token.type === 'link') {
				token.href = linkResolver?.(token.href) ?? token.href;
			} else if (token.type === 'image') {
				token.href = imageResolver?.(token.href) ?? token.href;
			} else if (token.type === 'html' && token.block) {
				const div = document.createElement('div');
				div.innerHTML = token.text;

				const imgs = div.querySelectorAll('img');
				imgs.forEach((img) => {
					const src = img.getAttribute('src');
					if (src) {
						img.setAttribute('src', imageResolver?.(src) ?? src);
					}
				});

				const links = div.querySelectorAll('a');
				links.forEach((link) => {
					const href = link.getAttribute('href');
					if (href) {
						link.setAttribute('href', linkResolver?.(href) ?? href);
					}
				});

				token.text = div.innerHTML;
			} else if (token.type === 'html' && !token.block) {
				// Chunks
				if (/^<a/.test(token.raw)) {
					const attributes = parseAttributes(token.text);

					if ('href' in attributes)
						attributes.href = linkResolver?.(attributes.href) ?? attributes.href;

					token.text = `<a ${buildAttributes(attributes)}>`;
				}

				if (/^<img/.test(token.raw)) {
					const attributes = parseAttributes(token.text);

					if ('src' in attributes)
						attributes.src = imageResolver?.(attributes.src) ?? attributes.src;

					token.text = `<img ${buildAttributes(attributes)}>`;
				}
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
	class={[
		'prose prose-hr:border-2 prose-hr:my-8 prose-hr:border-zinc-300 dark:prose-ht:border-zinc-700 prose-headings:border-b prose-headings:border-gray-300 prose-li:my-0 prose-headings:pb-2 prose-headings:my-2 prose-img:inline-block prose-img:my-0.5 dark:prose-a:text-gray-50 dark:prose-strong:text-gray-300 dark:prose-headings:text-gray-50 dark:prose-p:text-gray-300 dark:prose-td:text-gray-300 dark:prose-li:text-gray-300 dark:prose-code:text-gray-300  prose-code:before:content-none prose-code:after:content-none h-full w-full overflow-auto rounded-lg p-4',
		className
	]}
>
	{@html htmlContent}
</div>
