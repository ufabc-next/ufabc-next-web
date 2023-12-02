import { MFError } from '.';
import { render, screen } from '@/test-utils';

describe('<MFError />', () => {
  test('render error text', () => {
    render(MFError);
    expect(
      screen.getByText('Ocorreu um erro ao carregar, tente novamente'),
    ).toBeInTheDocument();
  });
});
