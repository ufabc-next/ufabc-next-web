const env = process.env.VUE_APP_MF_ENV;

const { dependencies } = require('./package.json');
const remotes = require(`./remotes.hosts.${env}.js`);

module.exports = {
  name: 'container',
  remotes,
  shared: {
    vue: {
      singleton: true,
      requiredVersion: dependencies.vue,
    },
    'vue-router': {
      singleton: true,
      requiredVersion: dependencies['vue-router'],
    },
    '@tanstack/react-query': {
      singleton: true,
      requiredVersion: dependencies['@tanstack/react-query'],
    },
    '@tanstack/vue-query': {
      singleton: true,
      requiredVersion: dependencies['@tanstack/vue-query'],
    },
    '@tanstack/query-core': {
      singleton: true,
      requiredVersion: dependencies['@tanstack/query-core'],
    },
  },
};
