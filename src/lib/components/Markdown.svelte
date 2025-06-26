<script lang="ts">
	import { Marked } from 'marked';
	import { markedHighlight } from 'marked-highlight';
	import DOMPurify from 'dompurify';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.min.css';

	const { content, githubMemberName }: { content: string; githubMemberName?: string } = $props();

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
						`https://raw.githubusercontent.com/${githubMemberName}/${githubMemberName}/refs/heads/main/`
					).toString();
				}
				return `<img src="${href}" alt="${text}" title="${title}" />`;
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
	class="prose prose-headings:border-b prose-headings:border-gray-300 prose-li:my-0 prose-headings:pb-2 prose-headings:my-2 prose-img:inline-block prose-img:my-0.5 prose-p: h-[calc(100vh-8rem)] w-[calc(100vw-8rem)] overflow-auto rounded-lg border border-gray-300 p-4"
>
	{@html htmlContent}
</div>
