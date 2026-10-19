import { archives } from '@/mocks/archives';
import { render, screen, userEvent } from '@/test-utils';
import { capitalizeName } from '@/utils/capitalizeName';

import { ArchivesPage } from '.';

const firstComponentName = capitalizeName(archives.data[0].component?.name);

describe('<ArchivesPage />', () => {
  test('lists archives and opens the first plan automatically', async () => {
    render(ArchivesPage);

    const matches = await screen.findAllByText(firstComponentName);
    expect(matches.length).toBeGreaterThan(0);
    expect(await screen.findByText('Listas encadeadas')).toBeInTheDocument();
    expect(screen.getByText('Ementa')).toBeInTheDocument();
    expect(screen.getByText('Sem disciplina vinculada')).toBeInTheDocument();
  });

  test('enables opening the file only for stored archives', async () => {
    render(ArchivesPage);
    await screen.findByText('Listas encadeadas');

    expect(
      screen.getByRole('button', { name: /Abrir arquivo/u })
    ).toBeEnabled();

    const unlinkedItem = screen
      .getByText('Sem disciplina vinculada')
      .closest('button');
    if (!unlinkedItem) {
      throw new Error('Unlinked archive item not found');
    }
    await userEvent.click(unlinkedItem);

    expect(
      await screen.findByText(/ainda não foi vinculado a uma disciplina/u)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Abrir arquivo/u })
    ).toBeDisabled();
  });

  test('marks the selected archive for assistive technology', async () => {
    render(ArchivesPage);
    await screen.findByText('Listas encadeadas');

    const items = screen.getAllByRole('button', { current: true });
    expect(items).toHaveLength(1);
  });
});
