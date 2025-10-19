import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig, type PluginOption } from 'vite';

// https://vite.dev/config/
export default defineConfig(() => {
  const plugins: PluginOption[] = [vue() as unknown as PluginOption];

  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});
