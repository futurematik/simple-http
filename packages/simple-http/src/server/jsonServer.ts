import { HttpServerMiddleware } from './HttpServerMiddleware';
import { HttpServer } from './HttpServer';
import { HttpServerResponse } from './HttpServerResponse';
import { HttpServerRequest } from './HttpServerRequest';
import { overrideValues } from '../values/overrideValues';
import { HttpError } from '../common/HttpError';
import { getLastValue } from '../values/getLastValue';
import { HttpContentType } from '../common/HttpContentType';
import { parseHeaderParams } from '../common/parseHeaderParams';

export function jsonServer(): HttpServerMiddleware {
  return (server: HttpServer): HttpServer => {
    return async (request): Promise<HttpServerResponse> => {
      const { body, ...rest } = request;

      const [contentType] = parseHeaderParams(
        getLastValue(request.headers, 'content-type'),
      );
      let parsedBody: {} | undefined;

      if (body) {
        try {
          if (contentType === HttpContentType.Json) {
            if (!body) {
              parsedBody = undefined;
            } else if (Buffer.isBuffer(body) || typeof body === 'string') {
              parsedBody = JSON.parse(body.toString());
            } else {
              throw new Error(
                `body isn't a string or buffer so can't be parsed`,
              );
            }
          }
        } catch {
          // ignore json parse exception
        }

        if (typeof parsedBody === 'undefined') {
          throw new HttpError(415, `unsupported media type`, {
            accept: HttpContentType.Json,
          });
        }
      }

      const typedRequest: HttpServerRequest = {
        ...rest,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        body: parsedBody,
      };

      const response = await server(typedRequest);

      const [responseType] = parseHeaderParams(
        response.headers && getLastValue(response.headers, 'content-type'),
      );

      let serializedBody: string | Buffer | undefined;

      if (
        response.body &&
        (!responseType || responseType === HttpContentType.Json)
      ) {
        if (
          Buffer.isBuffer(response.body) ||
          typeof response.body === 'string'
        ) {
          serializedBody = response.body;
        } else {
          serializedBody = JSON.stringify(response.body);
        }
      }

      return {
        ...response,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        body: serializedBody as any,
        headers: overrideValues(
          {
            'content-type': HttpContentType.Json,
          },
          response.headers || {},
        ),
      };
    };
  };
}
