import elementPlus from 'element-plus';
import { vuetify } from './vuetify';

import { render } from '@testing-library/vue';

const customRender: typeof render = (component, options) => {
  return render(component, {
    ...options,
    global: { plugins: [vuetify, elementPlus] },
  });
};

export { customRender as render };
export * from '@testing-library/vue';
