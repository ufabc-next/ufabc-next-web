import type {
  ArchivesPage,
  ArchiveDownload,
  ComponentPlan,
} from '@next/services';

export const archives = {
  data: [
    {
      _id: 'archive-1',
      component: {
        _id: 'component-1',
        disciplina: 'Algoritmos e Estruturas de Dados I',
        codigo: 'DA1MCTB021-17SA',
        turma: 'A1',
        turno: 'diurno',
        season: '2026:3',
      },
      createdAt: '2026-10-10T12:00:00.000Z',
      file_name: '20263_DA1MCTB021-17SA.pdf',
      original_url: 'https://example.com/20263_DA1MCTB021-17SA.pdf',
      source: 'cmcc',
      status: 'stored',
    },
    {
      _id: 'archive-2',
      component: {
        _id: 'component-2',
        disciplina: 'Cálculo de Funções de Uma Variável',
        codigo: 'DA1MCTA023-15SA',
        turma: 'A1',
        turno: 'noturno',
        season: '2026:3',
      },
      createdAt: '2026-10-09T09:30:00.000Z',
      file_name: 'lista-de-exercicios.pdf',
      original_url: 'https://example.com/lista-de-exercicios.pdf',
      source: 'moodle',
      status: 'stored',
    },
    {
      _id: 'archive-3',
      component: null,
      createdAt: '2026-10-08T18:45:00.000Z',
      file_name: null,
      original_url: 'https://example.com/quebrado.pdf',
      source: 'moodle',
      status: 'failed',
    },
  ],
  limit: 20,
  page: 1,
  total: 3,
} satisfies ArchivesPage;

export const archiveDownload = {
  expiresInSeconds: 300,
  fileName: '20263_DA1MCTB021-17SA.pdf',
  url: 'https://example.com/signed-url',
} satisfies ArchiveDownload;

export const componentPlan = {
  extractedAt: '2026-10-10T12:05:00.000Z',
  planning: {
    assessment: 'Duas provas e uma lista de exercícios.',
    methodology: 'Aulas expositivas e práticas em laboratório.',
    objectives: 'Introduzir estruturas de dados fundamentais.',
    syllabus: 'Listas, pilhas, filas, árvores e grafos.',
  },
  schedule: [
    { date: '06/10', lesson: 'Apresentação da disciplina' },
    { date: '13/10', lesson: 'Listas encadeadas' },
  ],
  timetable: ['segunda das 08:00 às 10:00, semanal'],
} satisfies ComponentPlan;
