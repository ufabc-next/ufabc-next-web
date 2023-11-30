import { MFError } from '.';
import { render, screen } from '@/test-utils';

describe('<MFError />', () => {
  it('render error text', () => {
    render(MFError);
    expect(
      screen.getByText('Ocorreu um erro ao carregar, tente novamente'),
    ).toBeInTheDocument();
  });
});
