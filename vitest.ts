import path from 'node:path';
import {startVitest} from 'vitest/node';
import {defineConfig} from 'vite';

const main = async (): Promise<void> => {
	const viteOverrides = defineConfig({
		build: {
			target: 'es2022',
		},
		resolve: {
			alias: {
				'@alias_root': path.resolve('./'),
			},
		},
		test: {
			...(process.argv.includes('--jsdom') ? {environment: 'jsdom'} : {}),
			...(process.argv.includes('--browser')
				? {
						browser: {
							provider: 'playwright',
							enabled: true,
							headless: true,
							instances: [{browser: 'chromium'}],
						},
					}
				: {}),
		},
	});

	console.log(viteOverrides);

	const vitest = await startVitest('test', [], {run: true}, viteOverrides, {});

	const testModules = vitest.state.getTestModules();
	for (const testModule of testModules) {
		console.log(testModule.moduleId, testModule.ok() ? 'passed' : 'failed');
	}

	await vitest.close();
};

void main();
