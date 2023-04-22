import ParseHTTPError from './ParseHTTPError';

/**
 * Parses a error and returns it's name and message
 * @param err
 * @returns
 */
export default function (err: any) {
  const parsed = ParseHTTPError(err);

  if (!parsed) {
    return null;
  }

  return parsed.toString();
}
