import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { readdirSync, readFileSync } from 'node:fs';

// Slugs of posts with `unlisted: true` (or drafts) in front matter, kept out of the sitemap.
const postsDir = './src/content/posts';
const hidden = readdirSync(postsDir)
  .filter((f) => /\.mdx?$/.test(f))
  .filter((f) => /^(unlisted|draft):\s*true\s*$/m.test(readFileSync(`${postsDir}/${f}`, 'utf8').split(/^---$/m)[1] ?? ''))
  .map((f) => f.replace(/\.mdx?$/, ''));

// Phase 1 lives at https://ribhuhooja.github.io. Change `site` if/when a custom domain is attached.
export default defineConfig({
  site: 'https://ribhuhooja.github.io',
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !page.includes('/courses/') && !hidden.some((slug) => page.includes(`/posts/${slug}/`)) }),
  ],
  markdown: {
    // Astro 7's default processor (Sätteri) doesn't run remark/rehype plugins; use the unified one for KaTeX.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { macros: { '\\R': '\\mathbb{R}', '\\Z': '\\mathbb{Z}', '\\C': '\\mathbb{C}', '\\HF': '\\mathit{HF}' } }]],
    }),
  },
});
