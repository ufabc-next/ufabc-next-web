import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ArchiveEngine } from '../../src/services/archive-engine.js';

const repositoryMock = vi.hoisted(() => ({
  findByCodigo: vi.fn(),
  findByDisciplinaKeywords: vi.fn(),
  setMoodleCourseId: vi.fn(),
}));

vi.mock('../../src/repositories/components-repository.js', () => ({
  ComponentsRepository: vi.fn(() => repositoryMock),
}));
vi.mock('../../src/connectors/moodle.js', () => ({ MoodleConnector: vi.fn() }));
vi.mock('../../src/models/Teacher.js', () => ({ findTeacher: vi.fn() }));

const codelessCourse = {
  fullname: 'Computação Gráfica',
  id: 1911,
  viewurl: 'https://moodle.ufabc.edu.br/course/view.php?id=1911',
};

describe('ArchiveEngine.findComponentByMoodleCourse', () => {
  beforeEach(() => {
    repositoryMock.findByCodigo.mockReset();
    repositoryMock.findByDisciplinaKeywords.mockReset();
    repositoryMock.setMoodleCourseId.mockReset();
  });

  it('matches a course without a discipline code by keywords within the enrolled codes', async () => {
    const component = { _id: 'component-id', disciplina: 'computação gráfica' };
    repositoryMock.findByDisciplinaKeywords.mockResolvedValue(component);

    const engine = new ArchiveEngine();
    const matched = await engine.findComponentByMoodleCourse(
      codelessCourse,
      [],
      ['MCCC007-23']
    );

    expect(matched).toBe(component);
    expect(repositoryMock.findByDisciplinaKeywords).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({ codigo: { $in: ['MCCC007-23'] } })
    );
  });

  it('does not guess by keywords alone when there is no code, teacher or enrollment filter', async () => {
    const engine = new ArchiveEngine();
    const matched = await engine.findComponentByMoodleCourse(
      codelessCourse,
      [],
      []
    );

    expect(matched).toBeNull();
    expect(repositoryMock.findByDisciplinaKeywords).not.toHaveBeenCalled();
  });
});
