import { HttpHandler } from './HttpHandler';
import { HttpResponse } from './HttpResponse';
import { HttpRequest } from './HttpRequest';
import { HttpHeaders } from './HttpHeaders';

export function jsonHandler<Request extends object, Response extends object>(
  handler: HttpHandler<Request, Response>,
): HttpHandler {
  return async function(request): Promise<HttpResponse> {
    const { body, ...rest } = request;

    const contentType = request.headers.get('Content-Type');
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
          headers: new HttpHeaders({
            Accept: 'application/json',
            'Content-Type': 'text/plain',
          }),
        };
      }
    }

    const typedRequest: HttpRequest<Request> = {
      ...rest,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      body: parsedBody!,
    };

    const response = await handler(typedRequest);

    return {
      ...response,
      body: JSON.stringify(response.body),
      headers: HttpHeaders.defaults(
        {
          'Content-Type': 'application/json',
        },
        response.headers,
      ),
    };
  };
}
