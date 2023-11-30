import { PerformanceCard } from '.';
import { render, screen } from '@/test-utils';

describe('<PerformanceCard />', () => {
  it('render a performance card title, subtitle and description', () => {
    render(PerformanceCard, {
      props: {
        title: 'title',
        description: 'description',
        subtitle: 'subtitle',
        color: 'primary',
        icon: 'mdi-trophy-outline',
      },
    });
    expect(screen.getByText(/^title/i)).toBeInTheDocument();
    expect(screen.getByText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/subtitle/i)).toBeInTheDocument();
  });
});
