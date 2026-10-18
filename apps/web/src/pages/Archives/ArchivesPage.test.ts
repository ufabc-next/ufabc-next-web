import { archives } from '@/mocks/archives';
import { render, screen, userEvent } from '@/test-utils';

import { ArchivesPage } from '.';

const firstComponentName = archives.data[0].component?.disciplina ?? '';

describe('<ArchivesPage />', () => {
  test('lists archives with source and status', async () => {
    render(ArchivesPage);

    expect(await screen.findByText(firstComponentName)).toBeInTheDocument();
    expect(screen.getByText('20263_DA1MCTB021-17SA.pdf')).toBeInTheDocument();
    expect(screen.getByText('Sem disciplina')).toBeInTheDocument();
    expect(screen.getAllByText('Falhou')).toHaveLength(1);
  });

  test('disables download for archives that are not stored', async () => {
    render(ArchivesPage);
    await screen.findByText(firstComponentName);

    const downloadButtons = screen.getAllByLabelText('Baixar arquivo');
    expect(downloadButtons[0]).toBeEnabled();
    expect(downloadButtons[2]).toBeDisabled();
  });

  test('shows the extracted plan of a component', async () => {
    render(ArchivesPage);
    await screen.findByText(firstComponentName);

    await userEvent.click(screen.getAllByLabelText('Ver plano de ensino')[0]);

    expect(await screen.findByText('Listas encadeadas')).toBeInTheDocument();
    expect(screen.getByText('Ementa')).toBeInTheDocument();
  });
});
