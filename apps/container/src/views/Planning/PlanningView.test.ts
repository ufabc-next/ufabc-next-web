import { PlanningView } from '.';
import { render, screen } from '@/test-utils';

describe('<PlanningView />', () => {
  it('render admin view', () => {
    render(PlanningView);
    expect(
      screen.getByRole('heading', { name: 'Planning' }),
    ).toBeInTheDocument();
  });
});
