import {
  render,
  screen,
  userEvent,
  waitForElementToBeRemoved,
} from '@/test-utils';
import { HistoryView } from '.';
import { enrollments } from '@/mocks/enrollments';
import { server } from '@/mocks/server';
import { rest } from 'msw';

describe('<CenteredLoading />', () => {
  test('render a loading before show subjects table', async () => {
    render(HistoryView);
    expect(screen.getByLabelText('Carregando')).toBeInTheDocument();
    expect(
      await screen.findByText(enrollments[0].disciplina),
    ).toBeInTheDocument();
    expect(screen.getByText(/disciplinas cursadas/i)).toBeInTheDocument();
  });
  test('show install extension warning if 0 enrollments', async () => {
    server.use(
      rest.get(`*/enrollments`, (_req, res, ctx) =>
        res(ctx.status(200), ctx.json([])),
      ),
    );
    render(HistoryView);
    expect(screen.getByLabelText('Carregando')).toBeInTheDocument();
    expect(
      await screen.findByText(/É necessário instalar a/i),
    ).toBeInTheDocument();
  });
  test('show install extension warning if only 1 enrollment', async () => {
    server.use(
      rest.get(`*/enrollments`, (_req, res, ctx) =>
        res(ctx.status(200), ctx.json([enrollments[0]])),
      ),
    );
    render(HistoryView);
    expect(screen.getByLabelText('Carregando')).toBeInTheDocument();
    expect(await screen.findByText(/disciplina cursada/i)).toBeInTheDocument();
  });
  test('show alert error if only one 5xx request happens', async () => {
    server.use(
      rest.get(`*/users/info`, (_req, res, ctx) => res(ctx.status(500))),
    );
    render(HistoryView, {
      // disable retry
      
    });
    expect(
      await screen.findByText(enrollments[0].disciplina),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        /Não foi possível buscar as informações, tente novamente mais tarde/i,
      ),
    ).toBeInTheDocument();
  });
  test('show alert errors if 5xx request happens', async () => {
    server.use(
      rest.get(`*/enrollments`, (_req, res, ctx) => res(ctx.status(500))),
      rest.get(`*/users/info`, (_req, res, ctx) => res(ctx.status(500))),
    );
    render(HistoryView);
    await waitForElementToBeRemoved(screen.queryByLabelText('Carregando'));
    expect(
      await screen.findAllByText(
        /Não foi possível buscar as informações, tente novamente mais tarde/i,
      ),
    ).toHaveLength(2);
  });
  test('open extension dialog when click on extension button then close it', async () => {
    const user = userEvent.setup();

    render(HistoryView);

    await waitForElementToBeRemoved(screen.queryByLabelText('Carregando'));

    await user.click(screen.getByLabelText(/Atualizar o histórico/));

    expect(screen.getByText(/Já tenho instalado/i)).toBeVisible();

    await user.click(screen.getByText(/Já tenho instalado/i));

    expect(screen.getByText(/Já tenho instalado/i)).not.toBeVisible();
  });
});
