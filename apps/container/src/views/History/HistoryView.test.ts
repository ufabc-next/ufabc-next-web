import { render, screen } from '@/test-utils';
import { HistoryView } from '.';

describe('<CenteredLoading />', () => {
  test('render a loading', () => {
    render(HistoryView);
    expect(screen.getByLabelText('Carregando')).toBeInTheDocument();
  });
});
