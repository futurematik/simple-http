import { LogFn } from '../common/LogInterop';
import { HttpClientMiddleware } from './HttpClientMiddleware';
import { HttpClient } from './HttpClient';
import { enhanceClient } from './enhanceClient';
import { HttpClientRequest } from './HttpClientRequest';
import { HttpClientResponse } from './HttpClientResponse';

export interface TraceClientOptions {
  trace?: LogFn;
  traceData?: object;
}

export function traceClient(
  options: LogFn | TraceClientOptions | undefined,
): HttpClientMiddleware {
  if (typeof options === 'function') {
    options = { trace: options };
  }
  const { trace, traceData } = options || {};

  return (client): HttpClient => {
    if (!trace) {
      return client;
    }
    return enhanceClient(
      async <Req, Res>(
        request: HttpClientRequest<Req>,
      ): Promise<HttpClientResponse<Res>> => {
        trace({ msg: `client request`, ...traceData, request });
        try {
          const response = (await client(request)) as HttpClientResponse<Res>;
          trace({ msg: `client response`, ...traceData, response });
          return response;
        } catch (err) {
          trace({ msg: `client unhandled error`, ...traceData, err });
          throw err;
        }
      },
    );
  };
}
