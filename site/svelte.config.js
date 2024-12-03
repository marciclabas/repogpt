import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		paths: {
			// base: '/repogpt'
		},
		alias: {
			"repogpt/*": "../repogpt/src/*",
      "repogpt": "../repogpt/src/index.js",
		},
		prerender: {
			handleHttpError: 'warn',
		}
	},
};

export default config;
