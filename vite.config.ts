import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// Vitest config - svelte-check doesn't include vitest types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		exclude: ['e2e', 'node_modules'],
		environment: 'jsdom',
		setupFiles: ['./src/tests/setup.ts']
	}
} as any);
