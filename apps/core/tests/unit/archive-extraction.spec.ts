import { UnrecoverableError } from 'bullmq';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ArchiveExtractionService } from '../../src/services/archive-extraction-service.js';

const modelMock = vi.hoisted(() => ({
  archiveFindById: vi.fn(),
  componentFindById: vi.fn(),
  metadataUpdate: vi.fn(),
}));

vi.mock('../../src/models/ComponentArchive.js', () => ({
  ComponentArchiveModel: {
    findById: () => ({ lean: modelMock.archiveFindById }),
  },
}));
vi.mock('../../src/models/Component.js', () => ({
  ComponentModel: { findById: () => ({ lean: modelMock.componentFindById }) },
}));
vi.mock('../../src/models/ComponentMetadata.js', () => ({
  ComponentMetadataModel: { findOneAndUpdate: modelMock.metadataUpdate },
}));

const extraction = {
  cronograma: [{ aula: 'Intro', data: '2026-02-09' }],
  planejamento: { avaliacao: 'a', ementa: 'e', metodologia: 'm', objetivos: 'o' },
};
const parserComponent = { ufClassroomCode: 'DA1MCTD019-18SA', ufComponentId: 7 };

function buildService(parserResult: unknown[]) {
  const extractor = { extractArchive: vi.fn().mockResolvedValue(extraction) };
  const service = new ArchiveExtractionService({
    bucket: 'bucket',
    extractor: extractor as never,
    parser: {
      getComponentByClassroomCode: vi.fn().mockResolvedValue(parserResult),
    } as never,
    s3Connector: {
      getPresignedUrl: vi.fn().mockResolvedValue('https://signed'),
    } as never,
  });
  return { extractor, service };
}

describe('ArchiveExtractionService.extractArchive', () => {
  beforeEach(() => {
    modelMock.archiveFindById.mockReset();
    modelMock.componentFindById.mockReset();
    modelMock.metadataUpdate.mockReset();
  });

  it('rejects archives that are not stored', async () => {
    modelMock.archiveFindById.mockResolvedValue({ status: 'failed' });
    const { service } = buildService([parserComponent]);

    await expect(service.extractArchive('a1')).rejects.toBeInstanceOf(
      UnrecoverableError
    );
  });

  it('sends a presigned url to the extractor and upserts by s3 key', async () => {
    modelMock.archiveFindById.mockResolvedValue({
      component: 'c1',
      s3_key: 'k.pdf',
      status: 'stored',
    });
    modelMock.componentFindById.mockResolvedValue({
      season: '2026:1',
      uf_cod_turma: 'DA1MCTD019-18SA',
    });
    const { extractor, service } = buildService([parserComponent]);

    await service.extractArchive('a1');

    expect(extractor.extractArchive).toHaveBeenCalledWith('https://signed');
    expect(modelMock.metadataUpdate).toHaveBeenCalledWith(
      { 'metadata.source_file': 'k.pdf' },
      expect.objectContaining({
        $set: expect.objectContaining({ cronograma: extraction.cronograma }),
      }),
      { upsert: true }
    );
  });
});
