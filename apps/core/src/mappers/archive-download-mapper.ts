export type ArchiveDownload = {
  expiresInSeconds: number;
  fileName?: string | null;
  url: string;
};

export class ArchiveDownloadMapper {
  toResponse(download: ArchiveDownload) {
    return {
      expiresInSeconds: download.expiresInSeconds,
      fileName: download.fileName ?? null,
      url: download.url,
    };
  }
}
