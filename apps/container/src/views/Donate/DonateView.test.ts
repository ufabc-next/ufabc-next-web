import { DonateView } from '.';
import { render, screen, userEvent, waitFor } from '@/test-utils';

describe('<DonateView />', () => {
  it('render donate view', () => {
    render(DonateView);
    expect(
      screen.getByRole('heading', { name: 'Ajude o UFABC Next' }),
    ).toBeInTheDocument();
  });
  it('open donate dialog', async () => {
    const user = userEvent.setup();

    render(DonateView);

    await user.click(screen.getByRole('button', { name: 'Quero ajudar!' }));

    expect(await screen.findByAltText('PIX do UFABC Next')).toBeInTheDocument();
  });
  it('close donate dialog', async () => {
    const user = userEvent.setup();

    render(DonateView);

    await user.click(screen.getByRole('button', { name: 'Quero ajudar!' }));

    expect(await screen.findByAltText('PIX do UFABC Next')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Fechar' }));

    await waitFor(() => {
      expect(screen.queryByAltText('PIX do UFABC Next')).not.toBeVisible();
    });
  });
});
