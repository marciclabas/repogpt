import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
      assets: 'build',
			// fallback: 'build/index.html'
		}),
		paths: {
			base: '/repogpt',
		},
		appDir: 'app_'
	},
};

export default config;
