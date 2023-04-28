import { defineAsyncComponent, h } from 'vue';
import Loading from '@/components/MFLoading.vue';
import Error from '@/components/MFError.vue';
import React from 'react';
import ReactDOM from 'react-dom/client';

export function defineFederatedReactComponent({
  loader = async () => ({ default: null }),
  component = 'default',
  ...options
}: any = {}) {
  return defineAsyncComponent({
    loader: async () =>
      defineReactComponent({
        component: ((await loader()) as any)[component],
        ...options,
      }),
    loadingComponent: Loading,
    errorComponent: Error,
    timeout: 1000,
  });
}

export function defineReactComponent({ component, ...options }: any) {
  return {
    ...options,
    setup(props: React.Attributes) {
      let app: ReactDOM.Root | null = null;

      return () =>
        h('div', {
          onVnodeMounted({ el }) {
            app = ReactDOM.createRoot(el as Element | DocumentFragment);
            app.render(React.createElement(component, props));
          },
          onVnodeBeforeUnmount() {
            app?.unmount();
            app = null;
          },
        });
    },
  };
}
