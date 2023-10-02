import '@testing-library/jest-dom';
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

global.CSS = { supports: () => false };

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
