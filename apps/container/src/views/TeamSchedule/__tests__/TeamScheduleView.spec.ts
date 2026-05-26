import { render, screen } from '@testing-library/vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TeamScheduleView from '../TeamScheduleView.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

// Since TeamScheduleGrid component handles most of the logic, 
// we test that the View renders it and the mock data properly flows.
describe('TeamScheduleView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders demonstration title and alert', () => {
    render(TeamScheduleView, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(screen.getByText('Agenda da Equipe')).toBeTruthy();
    expect(screen.getByText(/Visualizando a grade compartilhada/i)).toBeTruthy();
  });

  it('renders the Grid containing the 4 mocked users', () => {
    render(TeamScheduleView, {
      global: {
        plugins: [vuetify],
      },
    });

    // Verify grid headers
    expect(screen.getByText('Quadro Geral do Time')).toBeTruthy();
    
    // Verify some common subjects appear in the grid
    const becnNodes = screen.getAllByText(/Base Experimental das Ciências Naturais/i);
    expect(becnNodes.length).toBeGreaterThan(0);

    // Verify unique subjects appear
    expect(screen.getByText(/Física I/i)).toBeTruthy();
    expect(screen.getByText(/Geometria Analítica/i)).toBeTruthy();
    expect(screen.getByText(/Estrutura da Matéria/i)).toBeTruthy();

    // Verify students' names appear
    expect(screen.getAllByText('Bruno').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Rafa').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Carol').length).toBeGreaterThan(0);
    expect(screen.getAllByText('João').length).toBeGreaterThan(0);
  });
});
