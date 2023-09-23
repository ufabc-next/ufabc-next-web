import elementPlus from 'element-plus';
import { vuetify } from './vuetify';

export * from '@testing-library/vue';
import { render as testingLibraryRender } from '@testing-library/vue';

export const render: typeof testingLibraryRender = (component, options) => {
  return testingLibraryRender(component, {
    global: {
      plugins: [elementPlus, vuetify],
    },
    ...options,
  });
};
