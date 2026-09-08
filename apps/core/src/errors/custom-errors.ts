import { NextError } from './base-error.js';

export class EmailVerificationFailed extends NextError {
  constructor(
    description = 'Unable to verify user email',
    translatedDescription = 'Não foi possível verificar o e-mail do usuário'
  ) {
    super(
      'Email Verification Failed',
      'NEX0001',
      400,
      description,
      translatedDescription
    );
  }
}

export class UserWithoutRA extends NextError {
  constructor() {
    super(
      'User Without RA',
      'NEX0002',
      403,
      'User does not have an RA registered',
      'Usuário não possui um RA cadastrado'
    );
  }
}

export class ArchiveParseFailed extends NextError {
  constructor(description: string) {
    super(
      'Archive Parse Failed',
      'NEX0003',
      400,
      description,
      'Não foi possível processar o arquivo enviado'
    );
  }
}

export class ArchiveNotFound extends NextError {
  constructor() {
    super(
      'Archive Not Found',
      'NEX0004',
      404,
      'Archive not found or not yet stored',
      'Arquivo não encontrado ou ainda não armazenado'
    );
  }
}

export class ArchiveFileEmpty extends NextError {
  constructor() {
    super(
      'Archive File Empty',
      'NEX0005',
      500,
      'Empty file on S3',
      'O arquivo enviado está vazio'
    );
  }
}

export class DuplicateComment extends NextError {
  constructor(enrollment: string) {
    super(
      'Duplicate Comment',
      'NEX0006',
      409,
      `You can only comment once on enrollment ${enrollment}`,
      `Você só pode comentar uma vez neste vínculo ${enrollment}`
    );
  }
}
