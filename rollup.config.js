import svelte from 'rollup-plugin-svelte';
    import resolve from '@rollup/plugin-node-resolve';
    import commonjs from '@rollup/plugin-commonjs';
    import typescript from '@rollup/plugin-typescript';
    import css from 'rollup-plugin-css-only';
    import terser from '@rollup/plugin-terser';

    export default {
      input: 'src/lib/index.ts',
      output: [
        {
          file: 'dist/player.js',
          format: 'esm',
          name: 'ShakaPlayer',
          sourcemap: true,
          plugins: [terser()] // Added terser to ESM format too
        },
        {
          file: 'dist/player.min.js',
          format: 'umd',
          name: 'ShakaPlayer',
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
        css({
          output: 'player.css'
        }),
        resolve({
          browser: true,
          dedupe: ['svelte']
        }),
        commonjs(),
        typescript()
      ]
    }