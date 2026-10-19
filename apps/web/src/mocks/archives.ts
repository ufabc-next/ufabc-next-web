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
        name: 'Algoritmos e Estruturas de Dados I',
        code: 'DA1MCTB021-17SA',
        group: 'A1',
        shift: 'day',
        season: '2026:3',
      },
      fileName: '20263_DA1MCTB021-17SA.pdf',
      source: 'cmcc',
      status: 'stored',
    },
    {
      _id: 'archive-2',
      component: {
        _id: 'component-2',
        name: 'Cálculo de Funções de Uma Variável',
        code: 'DA1MCTA023-15SA',
        group: 'A1',
        shift: 'night',
        season: '2026:3',
      },
      fileName: 'lista-de-exercicios.pdf',
      source: 'moodle',
      status: 'stored',
    },
    {
      _id: 'archive-3',
      component: null,
      fileName: null,
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
