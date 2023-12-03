import { AdminView } from '.';
import { render, screen } from '@/test-utils';

describe('<AdminView />', () => {
  test('render admin view', () => {
    render(AdminView);
    expect(screen.getByRole('heading', { name: 'Admin' })).toBeInTheDocument();
  });
});
