import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

export default {
    input: 'src/lib/index.ts',
    output: [
        {
            file: 'dist/player.js',
            format: 'esm',
            name: 'ZPlayer',
            sourcemap: true,
        },
        {
            file: 'dist/player.min.js',
            format: 'umd',
            name: 'ZPlayer',
            plugins: [terser()],
            sourcemap: true
        }
    ],
    plugins: [
        svelte({
            compilerOptions: {
                dev: false
            },
            emitCss: true
        }),
        postcss({
            inject: true,
            minimize: true
        }),
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),
        typescript()
    ],
    onwarn(warning, warn) {
        // Ignore circular dependency warnings from svelte
        if (warning.code === 'CIRCULAR_DEPENDENCY' &&
            warning.message.includes('node_modules/svelte')) {
            return;
        }
        warn(warning);
    }
}