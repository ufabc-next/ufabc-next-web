import type { ComponentArchive } from '@/models/ComponentArchive.js';
import type { LeanPopulatedArchive } from '@/repositories/component-archives-repository.js';

export type PresignedDownload = {
  expiresInSeconds: number;
  url: string;
};

export type ArchivePagination = {
  limit: number;
  page: number;
  total: number;
};

export class ComponentArchiveMapper {
  toResponse(archive: LeanPopulatedArchive) {
    let component = null;
    if (archive.component) {
      component = {
        _id: archive.component._id.toString(),
        codigo: archive.component.codigo,
        disciplina: archive.component.disciplina,
        season: archive.component.season,
        turma: archive.component.turma,
        turno: archive.component.turno,
      };
    }

    return {
      _id: archive._id.toString(),
      component,
      file_name: archive.file_name ?? null,
      original_url: archive.original_url,
      source: archive.source,
      status: archive.status,
    };
  }

  toPageResponse(
    archives: LeanPopulatedArchive[],
    pagination: ArchivePagination
  ) {
    const data = [];
    for (const archive of archives) {
      data.push(this.toResponse(archive));
    }

    return {
      data,
      limit: pagination.limit,
      page: pagination.page,
      total: pagination.total,
    };
  }

  toDownloadResponse(archive: ComponentArchive, presigned: PresignedDownload) {
    return {
      expiresInSeconds: presigned.expiresInSeconds,
      fileName: archive.file_name ?? null,
      url: presigned.url,
    };
  }
}
