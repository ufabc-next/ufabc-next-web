import type { ComponentArchive } from '@/models/ComponentArchive.js';

export type PresignedDownload = {
  expiresInSeconds: number;
  url: string;
};

export class ArchiveDownloadMapper {
  toResponse(archive: ComponentArchive, presigned: PresignedDownload) {
    return {
      expiresInSeconds: presigned.expiresInSeconds,
      fileName: archive.file_name ?? null,
      url: presigned.url,
    };
  }
}
