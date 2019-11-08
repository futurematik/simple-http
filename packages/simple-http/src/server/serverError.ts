import { LogFn } from '../common/LogInterop';
import { HttpServerMiddleware } from './HttpServerMiddleware';
import { HttpServer } from './HttpServer';
import { HttpServerResponse } from './HttpServerResponse';
import { HttpError } from '../common/HttpError';
import { HttpValueCollection } from '../values/HttpValueCollection';

export interface ServerErrorOptions {
  log?: LogFn;
  logParams?: object;
}

export function serverError({
  log,
  logParams,
}: ServerErrorOptions): HttpServerMiddleware {
  return (server: HttpServer): HttpServer => {
    return async (request): Promise<HttpServerResponse> => {
      try {
        return await server(request);
      } catch (err) {
        let body: unknown = 'HTTP Server Error';
        let status = 500;
        let headers: HttpValueCollection | undefined;

        if (err instanceof HttpError) {
          body = err.body;
          status = err.status;
          headers = err.headers;
        }
        if (log) {
          log({ msg: `server error`, ...logParams, err });
        }
        return {
          body,
          headers,
          status,
        };
      }
    };
  };
}
