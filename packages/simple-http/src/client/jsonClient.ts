import { HttpClientMiddleware } from './HttpClientMiddleware';
import { HttpClient } from './HttpClient';
import { enhanceClient } from './enhanceClient';
import { HttpClientRequest } from './HttpClientRequest';
import { HttpClientResponse } from './HttpClientResponse';
import { parseHeaderParams } from '../common/parseHeaderParams';
import { getLastValue } from '../values/getLastValue';
import { HttpContentType } from '../common/HttpContentType';
import { setValue } from '../values/setValue';

export function jsonClient(): HttpClientMiddleware {
  return (client): HttpClient => {
    return enhanceClient(
      async <Req, Res>(
        req: HttpClientRequest<Req>,
      ): Promise<HttpClientResponse<Res>> => {
        const body = req.body;
        let headers = req.headers || {};
        let encodedBody: string | undefined;

        if (typeof body === 'undefined' || typeof body === 'string') {
          encodedBody = body || undefined;
        } else {
          const [contentType] = parseHeaderParams(
            getLastValue(headers, 'content-type') || HttpContentType.Json,
          );

          switch (contentType) {
            case HttpContentType.Json:
              encodedBody = JSON.stringify(body);
              break;

            case HttpContentType.Form:
              encodedBody = new URLSearchParams(body as {}).toString();
              break;

            default:
              throw new Error(
                `don't know how to encode content-type: ${contentType}`,
              );
          }

          headers = setValue(headers, 'content-type', contentType);
        }

        const response = await client({ ...req, body: encodedBody, headers });
        let responseBody = response.body;

        const [responseType] = parseHeaderParams(
          getLastValue(response.headers, 'content-type'),
        );

        if (responseBody && responseType === HttpContentType.Json) {
          if (typeof responseBody === 'string') {
            try {
              responseBody = JSON.parse(responseBody.toString());
            } catch {}
          }
        }

        return {
          ...response,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          body: responseBody as any,
        };
      },
    );
  };
}
