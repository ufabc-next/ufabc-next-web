import { HttpResponse, http } from 'msw';
import { SettingsView } from '.';
import { render, screen, userEvent, waitFor } from '@/test-utils';
import { user as mockedUser } from '@/mocks/users';
import { server } from '@/mocks/server';
import { useAuth } from '@/stores/useAuth';

describe('<SettingsView />', () => {
  const originalUseAuthValue = useAuth.getState();
  beforeEach(() => {
    useAuth.setState({
      ...originalUseAuthValue,
      token: 'token',
      user: mockedUser,
    });
  });
  afterEach(() => {
    useAuth.setState(originalUseAuthValue);
  });
  it('render settings loading when user info not loaded', () => {
    render(SettingsView);
    expect(screen.getByLabelText('Carregando')).toBeInTheDocument();
  });
  it('render user info', async () => {
    render(SettingsView);
    expect(
      await screen.findByText(mockedUser.email.replace(/(.*)@.*/, '$1')),
    ).toBeInTheDocument();
    expect(await screen.findByText(mockedUser.email)).toBeInTheDocument();
    expect(
      await screen.findByText(
        `Usuário desde ${new Date(mockedUser.createdAt).toLocaleDateString(
          'pt-BR',
          {
            timeZone: 'UTC',
          },
        )}`,
      ),
    ).toBeInTheDocument();
  });
  it('render user without associated accounts', async () => {
    server.use(
      http.get(/.*\/users\/info/, () =>
        HttpResponse.json({
          ...mockedUser,
          oauth: {
            email: mockedUser.email,
          },
        }),
      ),
    );
    render(SettingsView);
    expect(
      await screen.findByText('Associar à uma conta do Facebook'),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Associar à uma conta do Google'),
    ).toBeInTheDocument();
  });
  it('deactivate user', async () => {
    const user = userEvent.setup();

    render(SettingsView);

    user.click(await screen.findByText('Desativar Conta'));
    expect(await screen.findAllByText('Excluir conta')).toHaveLength(2);

    expect(useAuth.getState().token).not.toBeNull();
    expect(useAuth.getState().user).not.toBeNull();
    user.click(screen.getByRole('button', { name: 'Excluir conta' }));
    await waitFor(() => {
      expect(useAuth.getState().token).toBeNull();
      expect(useAuth.getState().user).toBeNull();
    });
  });
  it('show toast if error when deactivate user', async () => {
    const user = userEvent.setup();

    render(SettingsView);

    user.click(await screen.findByText('Desativar Conta'));
    expect(await screen.findAllByText('Excluir conta')).toHaveLength(2);

    expect(useAuth.getState().token).not.toBeNull();
    expect(useAuth.getState().user).not.toBeNull();
    user.click(screen.getByRole('button', { name: 'Excluir conta' }));
  });

  // eslint-disable-next-line test/no-identical-title
  it('show toast if error when deactivate user', async () => {
    server.use(
      http.delete(/.*\/users\/me\/delete/, () => HttpResponse.error()),
    );

    const user = userEvent.setup();

    render(SettingsView);

    user.click(await screen.findByText('Desativar Conta'));
    expect(await screen.findAllByText('Excluir conta')).toHaveLength(2);

    user.click(screen.getByRole('button', { name: 'Excluir conta' }));
    expect(
      await screen.findByText('Ocorreu um erro ao tentar excluir sua conta'),
    );
  });
});
