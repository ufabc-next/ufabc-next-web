import '@testing-library/jest-dom/vitest';

import { server } from '@/mocks/server';

class ResizeObserverStub {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
}

window.ResizeObserver = window.ResizeObserver || ResizeObserverStub;

if (!window.visualViewport) {
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: {
      width: window.innerWidth,
      height: window.innerHeight,
      offsetLeft: 0,
      offsetTop: 0,
      pageLeft: 0,
      pageTop: 0,
      scale: 1,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    },
  });
}

if (!window.CSS) {
  Object.defineProperty(window, 'CSS', {
    configurable: true,
    value: {
      supports: () => false,
    },
  });
} else if (typeof window.CSS.supports !== 'function') {
  window.CSS.supports = () => false;
}

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
