import { render, screen } from '@testing-library/vue';
import { CenteredLoading } from '.';
import { vuetify } from '@/vuetify';

describe('<CenteredLoading />', () => {
  test('render a loading', () => {
    render(CenteredLoading, {
      global: {
        plugins: [vuetify],
      },
    });
    expect(screen.getByLabelText('Carregando')).toBeInTheDocument();
  });
});
