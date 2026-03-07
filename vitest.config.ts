import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}'],
			exclude: ['e2e', 'node_modules'],
			environment: 'jsdom',
			setupFiles: ['./src/tests/setup.ts']
		}
	})
);
