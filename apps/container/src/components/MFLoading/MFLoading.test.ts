import { MFLoading } from '.';
import { render, screen } from '@/test-utils';

describe('<MFLoading />', () => {
  test('render a loading', () => {
    render(MFLoading);
    expect(screen.getByLabelText('Carregando')).toBeInTheDocument();
  });
});
