const { defineConfig } = require('@vue/cli-service');
const { ModuleFederationPlugin } = require('webpack').container;
const { dependencies } = require('./package.json');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new ModuleFederationPlugin({
        name: 'host',
        remotes: {
          react: 'react@http://localhost:8081/remoteEntry.js',
        },
        shared: dependencies,
      }),
    ],
  },
});
