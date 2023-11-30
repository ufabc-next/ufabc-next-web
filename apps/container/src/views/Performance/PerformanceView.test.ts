import { PerformanceView } from '.';
import { render, screen } from '@/test-utils';

describe('<PerformanceView />', () => {
  it('render loading', () => {
    render(PerformanceView);
    expect(screen.getByLabelText('Carregando')).toBeInTheDocument();
  });
  it('render performance page', async () => {
    render(PerformanceView);

    expect(
      await screen.findByText('Seu maior CR até hoje'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Possuem um CR muito próximo ao seu'),
    ).toBeInTheDocument();
    expect(screen.getByText('Seu melhor quadrimestre')).toBeInTheDocument();
    expect(
      screen.getByText('Quadrimestre com mais créditos'),
    ).toBeInTheDocument();

    expect(screen.getByText('3.21')).toBeInTheDocument();
    expect(screen.getByText('184')).toBeInTheDocument();
  });
});
