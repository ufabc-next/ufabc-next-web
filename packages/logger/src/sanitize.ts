const SENSITIVE_HEADER_KEYS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
]);

const SENSITIVE_QUERY_KEYS = ['token', 'access_token', 'code', 'state'];

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

  const sanitizedQuery: Record<string, unknown> = {};
  for (const [queryKey, queryValue] of Object.entries(query)) {
    if (SENSITIVE_QUERY_KEYS.includes(queryKey)) {
      sanitizedQuery[queryKey] = '[REDACTED]';
    } else {
      sanitizedQuery[queryKey] = queryValue;
    }
  }

  return JSON.stringify(sanitizedQuery);
}

export function sanitizeUrl(url: string): string {
  const queryStart = url.indexOf('?');
  if (queryStart === -1) {
    return url;
  }

  const pathname = url.slice(0, queryStart);
  const searchParams = new URLSearchParams(url.slice(queryStart + 1));
  for (const sensitiveKey of SENSITIVE_QUERY_KEYS) {
    if (searchParams.has(sensitiveKey)) {
      searchParams.set(sensitiveKey, '[REDACTED]');
    }
  }

  return `${pathname}?${searchParams.toString()}`;
}
