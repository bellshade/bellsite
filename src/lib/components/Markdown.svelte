<script lang="ts">
	import { Marked } from 'marked';
	import { markedHighlight } from 'marked-highlight';
	import DOMPurify from 'dompurify';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.min.css';

	const { baseUrl, content }: { baseUrl: string; content: string; } = $props();

	const marked = new Marked(
		markedHighlight({
			async: false,
			highlight: (code, lang, info) => {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext';
				return hljs.highlight(code, { language }).value;
			}
		})
	);

	marked.use({
		renderer: {
			image: ({ href, title, text, tokens }) => {
				if (href.startsWith('.')) {
					href = new URL(
						href,
						baseUrl
					).toString();
				}
				return `<img src="${href}" alt="${text}" title="${title}" />`;
			},
			html: token => {
				return token.raw.replace(/<(img|a)(\s+.*?)(src|href)="(.*?)"(.*?)>/g, (m, tag, sp1, attrname, src, sp2) => {
					if (src.startsWith('.')) {
	  					return `<${tag}${sp1}${attrname}="${new URL(
	   						src,
	   						baseUrl
	  					).toString()}"${sp2}>`;
	 				}

	 				return m;
				});
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
	class="prose prose-headings:border-b prose-headings:border-gray-300 prose-li:my-0 prose-headings:pb-2 prose-headings:my-2 prose-img:inline-block prose-img:my-0.5 prose-p: h-full w-full overflow-auto rounded-lg p-4"
>
	{@html htmlContent}
</div>
