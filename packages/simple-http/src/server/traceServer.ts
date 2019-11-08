import { LogFn } from '../common/LogInterop';
import { HttpServerMiddleware } from './HttpServerMiddleware';
import { HttpServer } from './HttpServer';
import { HttpServerRequest } from './HttpServerRequest';
import { HttpServerResponse } from './HttpServerResponse';

export interface TraceServerOptions {
  trace?: LogFn;
  traceData?: object;
}

export function traceServer({
  trace,
  traceData,
}: TraceServerOptions): HttpServerMiddleware {
  return (server): HttpServer => {
    if (!trace) {
      return server;
    }
    return async (request: HttpServerRequest): Promise<HttpServerResponse> => {
      trace({ msg: `server request`, ...traceData, request });
      try {
        const response = await server(request);
        trace({ msg: `server response`, ...traceData, response });
        return response;
      } catch (err) {
        trace({ msg: `server unhandled error`, ...traceData, err });
        throw err;
      }
    };
  };
}
