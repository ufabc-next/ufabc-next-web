import { AxiosError } from 'axios';
import ParseHTTPError from './ParseHTTPError';

/**
 * Parses a error and returns it's name and message
 * @param err
 * @returns
 */
export default function (err: AxiosError<{ error: string }>) {
  const parsed = ParseHTTPError(err);
  return `${parsed.message}`; // This needs to be aligned with the backend
}
