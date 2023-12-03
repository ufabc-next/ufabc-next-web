import { CenteredLoading } from '.';
import { render, screen } from '@/test-utils';

describe('<CenteredLoading />', () => {
  test('render a loading', () => {
    render(CenteredLoading);
    expect(screen.getByLabelText('Carregando')).toBeInTheDocument();
  });
});
