import elementPlus from 'element-plus';
import { createVuetify } from 'vuetify';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { render } from '@testing-library/vue';

import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
export { default as userEvent } from '@testing-library/user-event';

const vuetify = createVuetify({
  components,
  directives,
});

const customRender: typeof render = (component, options) => {
  return render(component, {
    ...options,
    global: {
      plugins: [
        vuetify,
        elementPlus,
        [
          VueQueryPlugin,
          {
            queryClient: new QueryClient({
              defaultOptions: {
                queries: {
                  retry: false,
                },
              },
            }),
          },
        ],
      ],
    },
  });
};

export { customRender as render };
export * from '@testing-library/vue';
