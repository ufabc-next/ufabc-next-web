import { render } from '@/test-utils';
import { ConfirmationView } from '.';

vi.mock('@/views/Calengrade', () => ({
  CalengradeView: () => 'CalengradeView',
}));

describe('<ConfirmationView />', () => {
  beforeEach(() => {});

  test('render confirmation view', () => {
    render(ConfirmationView);
  });
});
