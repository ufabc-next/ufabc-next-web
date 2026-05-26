import { render, screen, fireEvent } from '@testing-library/vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import TeamScheduleView from '../TeamScheduleView.vue';
import * as vueQuery from '@tanstack/vue-query';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Ensure Vuetify is instantiated for the tests
const vuetify = createVuetify({
  components,
  directives,
});

vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn(),
}));

describe('TeamScheduleView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial state correctly', () => {
    // @ts-ignore
    vi.mocked(vueQuery.useQuery).mockReturnValue({
      isLoading: ref(false),
      isError: ref(false),
      data: ref(null),
      isSuccess: ref(false),
      refetch: vi.fn(),
    });

    render(TeamScheduleView, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(screen.getByText('Compartilhamento de Grade')).toBeTruthy();
    expect(screen.getByLabelText('RA do Aluno')).toBeTruthy();
    expect(screen.getByLabelText('Quadrimestre (Ex: 2026:2)')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Buscar/i })).toBeTruthy();
  });

  it('calls refetch on button click', async () => {
    const mockRefetch = vi.fn();
    // @ts-ignore
    vi.mocked(vueQuery.useQuery).mockReturnValue({
      isLoading: ref(false),
      isError: ref(false),
      data: ref(null),
      isSuccess: ref(false),
      refetch: mockRefetch,
    });

    render(TeamScheduleView, {
      global: {
        plugins: [vuetify],
      },
    });

    const button = screen.getByRole('button', { name: /Buscar/i });
    await fireEvent.click(button);

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('displays data when successful', () => {
    // @ts-ignore
    vi.mocked(vueQuery.useQuery).mockReturnValue({
      isLoading: ref(false),
      isError: ref(false),
      isSuccess: ref(true),
      refetch: vi.fn(),
      data: ref([
        {
          season: '2026:2',
          groupURL: 'http://whatsapp.com/group1',
          codigo: 'BC0001',
          campus: 'sa',
          turma: 'A',
          turno: 'Noturno',
          subject: 'Base Experimental das Ciências Naturais',
          teoria: 'Segunda 19h',
          pratica: 'Quarta 19h',
          uf_cod_turma: '1234',
        },
      ]),
    });

    render(TeamScheduleView, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(screen.getByText(/Base Experimental das Ciências Naturais/i)).toBeTruthy();
    expect(screen.getByText(/BC0001/i)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Entrar no Grupo/i })).toBeTruthy();
  });

  it('displays error message when request fails', () => {
    // @ts-ignore
    vi.mocked(vueQuery.useQuery).mockReturnValue({
      isLoading: ref(false),
      isError: ref(true),
      isSuccess: ref(false),
      refetch: vi.fn(),
      data: ref(null),
    });

    render(TeamScheduleView, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(screen.getByText(/Não foi possível carregar a grade/i)).toBeTruthy();
  });
});
