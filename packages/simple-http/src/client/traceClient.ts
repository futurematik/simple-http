import { LogFn } from '../common/LogInterop';
import { HttpClientMiddleware } from './HttpClientMiddleware';
import { HttpClient } from './HttpClient';
import { enhanceClient } from './enhanceClient';
import { HttpClientRequest } from './HttpClientRequest';
import { HttpClientResponse } from './HttpClientResponse';

export function traceClient(trace: LogFn | undefined): HttpClientMiddleware {
  return (client): HttpClient => {
    if (!trace) {
      return client;
    }
    return enhanceClient(
      async <Req, Res>(
        request: HttpClientRequest<Req>,
      ): Promise<HttpClientResponse<Res>> => {
        trace({ msg: `REQUEST`, request });
        const response = (await client(request)) as HttpClientResponse<Res>;
        trace({ msg: `RESPONSE`, response });
        return response;
      },
    );
  };
}
