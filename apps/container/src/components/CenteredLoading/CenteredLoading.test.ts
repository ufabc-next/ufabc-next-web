import { CenteredLoading } from '.';
import { render, screen } from '@/test-utils';

describe('<CenteredLoading />', () => {
  it('render a loading', () => {
    render(CenteredLoading);
    expect(screen.getByLabelText('Carregando')).toBeInTheDocument();
  });
});
