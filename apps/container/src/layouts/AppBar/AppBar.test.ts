import { createPinia, setActivePinia } from 'pinia';
import { useRouter } from 'vue-router';

import { user as mockedUser } from '@/mocks/users';
import { useAuthStore } from '@/stores/auth';
import { render, screen, userEvent, waitFor } from '@/test-utils';

import { AppBar } from '.';

vi.mock('vue-router', async () => ({
  useRouter: vi.fn(),
  createRouter: vi.fn(() => ({
    beforeEach: vi.fn(),
  })),
  createWebHistory: vi.fn(),
}));

describe('<AppBar />', () => {
  let authStore: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.mocked(useRouter).mockReturnValue({
      go: vi.fn(),
      push: vi.fn(),
      replace: vi.fn(),
      currentRoute: {
        value: {
          query: {},
          meta: {},
        },
      },
    } as unknown as ReturnType<typeof useRouter>);
    authStore = useAuthStore();
    authStore.token = 'mock-token';
    authStore.user = mockedUser;
  });

  afterEach(() => {
    authStore.logOut();
    vi.restoreAllMocks();
  });

  test('render app bar', () => {
    render(AppBar);
    expect(
      screen.getAllByRole('img', { name: 'logo do UFABC Next' }),
    ).toHaveLength(2);
    expect(screen.getByText('Reviews')).toBeInTheDocument();
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('Snapshot da Matrícula')).toBeInTheDocument();
    expect(screen.getByText('Grupos no WhatsApp')).toBeInTheDocument();
  });
  test('render theme toggle button', () => {
    render(AppBar);

    expect(
      screen.getByRole('button', { name: 'Toggle theme' }),
    ).toBeInTheDocument();
  });

  test('toggle between sun and moon icons', async () => {
    const user = userEvent.setup();

    render(AppBar);

    const toggleButton = screen.getByRole('button', { name: 'Toggle theme' });
    expect(toggleButton).toBeInTheDocument();

    await user.click(toggleButton);
    await user.click(toggleButton);
  });

  test('render user menu with settings and sign out options', async () => {
    const user = userEvent.setup();

    render(AppBar);

    const activator = screen
      .getByText(mockedUser.email.replace('@aluno.ufabc.edu.br', ''))
      .closest('div');
    expect(activator).toBeInTheDocument();
    await user.click(activator!);

    await waitFor(() => {
      expect(screen.getByText('Configurações')).toBeInTheDocument();
      expect(screen.getByText('Sair')).toBeInTheDocument();
    });
  });

  test('render without crashing when router injection is unavailable', () => {
    vi.mocked(useRouter).mockReturnValue(
      undefined as unknown as ReturnType<typeof useRouter>,
    );

    expect(() =>
      render(AppBar, {
        global: {
          stubs: {
            UserMenu: true,
          },
        },
      }),
    ).not.toThrow();

    expect(screen.getAllByRole('img', { name: 'logo do UFABC Next' })).toHaveLength(
      2,
    );
  });
});
