import { AxiosError } from 'axios';

/**
 * // Parses a error and returns it's name and message
 * @param err
 * @returns error type
 */
export default function (err: AxiosError<{ error: string }>) {
  // Its not an error
  // if (!err) {
  //   return null;
  // }

  // If it's an response wrapped in an error, unwrap it
  // const response = err.response ? err.response : err;

  // If not a valid object, return
  // if (!response) {
  //   return err;
  // }

  // Not a response object
  // if (!response.data) {
  //   return err;
  // }
  // If it has a Response object
  // const data = response.data;

  function typeForCode(code: string): string {
    const HTTP_CODES: Record<string, string> = {
      '400': 'BadRequest',
      '401': 'Unauthorized',
      '403': 'Forbidden',
      '404': 'NotFound',
      '409': 'Conflict',
      '422': 'Unprocessable',
      '500': 'InternalError',
    };

    return HTTP_CODES[code] || 'Error';
  }

  function BuildError(obj: { error: string; type: string; code?: string }) {
    const error = new Error(obj.error);
    error.name = obj.type || error.name;

    Object.assign(error, obj);

    return error;
  }
  if (err.response) {
    const stringStatus = err.response.status.toString();
    return BuildError({
      type: typeForCode(stringStatus),
      error: err.response.data.error,
      code: err.request.status,
    });
  } else {
    return BuildError({
      type: '500',
      error: 'InternalError',
    });
  }
}
