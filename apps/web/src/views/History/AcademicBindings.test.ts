import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { http, HttpResponse } from 'msw';

import { enrollments } from '@/mocks/enrollments';
import { server } from '@/mocks/server';
import {
  defaultPlugins,
  render,
  screen,
  userEvent,
  waitFor,
} from '@/test-utils';

import HistoryView from './HistoryView.vue';

test('shows inactive history and filters by binding rather than RA', async () => {
  const rows = [
    {
      ...enrollments[0],
      _id: 'synthetic-old',
      disciplina: 'Disciplina Anterior',
      ra: 111,
      academicBindingId: 'old-binding',
      active: false,
    },
    {
      ...enrollments[0],
      _id: 'synthetic-new',
      disciplina: 'Disciplina Atual',
      ra: 222,
      academicBindingId: 'new-binding',
      active: true,
    },
  ];
  server.use(http.get('*/entities/enrollments', () => HttpResponse.json(rows)));
  render(HistoryView, {
    global: {
      plugins: [
        ...defaultPlugins.filter((plugin) => !Array.isArray(plugin)),
        [
          VueQueryPlugin,
          {
            queryClient: new QueryClient({
              defaultOptions: { queries: { retry: false } },
            }),
          },
        ],
      ],
    },
  });
  expect(await screen.findByText('Disciplina Anterior')).toBeVisible();
  expect(await screen.findByText('Disciplina Atual')).toBeVisible();
  const user = userEvent.setup();
  await user.click(screen.getByRole('combobox', { name: /Vínculo acadêmico/ }));
  await user.click(await screen.findByRole('option', { name: /RA 111/ }));
  await waitFor(() =>
    expect(screen.queryByText('Disciplina Atual')).not.toBeInTheDocument()
  );
  expect(screen.getByText('Disciplina Anterior')).toBeVisible();
});
