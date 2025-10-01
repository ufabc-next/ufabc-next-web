import { defineConfig } from 'rollup';
import vue from 'rollup-plugin-vue';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import fg from 'fast-glob';

const entries = fg.sync('email-templates/*.vue');

export default defineConfig({
  input: entries,
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: '[name].js',
  },
  plugins: [
    vue(),
    nodeResolve(),
    commonjs({
      include: /node_modules/,
    }),
  ],
});
