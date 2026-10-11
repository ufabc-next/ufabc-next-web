const SENSITIVE_HEADER_KEYS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-academic-token',
  'session-id',
  'view-id',
  'view-state',
  'sess-key',
]);

export function sanitizeCredentials(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeCredentials);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      ['accesstoken', 'credentialhash'].includes(key.toLowerCase())
        ? '[REDACTED]'
        : sanitizeCredentials(child),
    ])
  );
}

export function sanitizeHeaders(
  headers: Headers | Record<string, unknown> | undefined
): Record<string, unknown> | undefined {
  if (!headers) {
    return headers;
  }

  const entries =
    headers instanceof Headers
      ? Array.from(headers.entries())
      : Object.entries(headers);

  const sanitizedEntries = entries.map(([headerKey, headerValue]) =>
    SENSITIVE_HEADER_KEYS.has(headerKey.toLowerCase())
      ? [headerKey, '[REDACTED]']
      : [headerKey, headerValue]
  );

  return Object.fromEntries(sanitizedEntries);
}

export function serializeQueryParams(query: unknown): string | undefined {
  if (!query || typeof query !== 'object' || Object.keys(query).length === 0) {
    return undefined;
  }

  return JSON.stringify(query);
}
