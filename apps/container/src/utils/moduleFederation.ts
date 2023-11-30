import { defineAsyncComponent, h } from 'vue';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MFLoading } from '@/components/MFLoading';
import { MFError } from '@/components/MFError';

export function defineFederatedReactComponent({
  loader = async () => ({ default: null }),
  component = 'default',
  ...options
}: any = {}) {
  return defineAsyncComponent({
    loader: async () =>
      defineReactComponent({
        component: (await loader())[component],
        ...options,
      }),
    loadingComponent: MFLoading,
    errorComponent: MFError,
    timeout: 1000,
  });
}

export function defineReactComponent({ component, ...options }: any = {}) {
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
          style: {
            width: '100%',
            height: '100%',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          },
        });
    },
  };
}
