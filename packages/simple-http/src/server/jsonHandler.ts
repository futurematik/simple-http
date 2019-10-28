import { HttpServer } from './HttpServer';
import { HttpServerResponse } from './HttpServerResponse';
import { getValue } from '../values/getValue';
import { HttpServerRequest } from './HttpServerRequest';
import { overrideValues } from '../values/overrideValues';

export function jsonHandler<Request, Response>(
  handler: HttpServer<Request, Response>,
): HttpServer {
  return async function(request): Promise<HttpServerResponse> {
    const { body, ...rest } = request;
    debugger;

    const contentType = getValue(request.headers, 'content-type');
    let parsedBody: Request | undefined;

    if (body) {
      try {
        const isJson =
          typeof contentType === 'string' &&
          contentType.startsWith('application/json');

        if (isJson) {
          parsedBody = JSON.parse(body.toString());
        }
      } catch {
        // ignore json parse exception
      }

      if (typeof parsedBody === 'undefined') {
        return {
          status: 415,
          body: `unsupported media type`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'text/plain',
          },
        };
      }
    }

    const typedRequest: HttpServerRequest<Request> = {
      ...rest,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      body: parsedBody!,
    };

    const response = await handler(typedRequest);

    return {
      ...response,
      body: JSON.stringify(response.body),
      headers: overrideValues(
        {
          'Content-Type': 'application/json',
        },
        response.headers || {},
      ),
    };
  };
}
