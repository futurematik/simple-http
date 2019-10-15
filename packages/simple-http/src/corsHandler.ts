import { HttpHandler } from './HttpHandler';
import { HttpResponse } from './HttpResponse';
import { HttpRequest } from './HttpRequest';
import { HttpHeaders } from './HttpHeaders';

export interface CorsOptions {
  credentials?: boolean;
  exposeHeaders?: string[];
  headers?: string[];
  maxAge?: number;
  methods?: string[];
  origin?: string;
  vary?: string[];
}

export const defaultCorsOptions: Required<CorsOptions> = {
  credentials: false,
  exposeHeaders: [],
  headers: [],
  maxAge: 3600,
  methods: ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT'],
  origin: '*',
  vary: ['Origin'],
};

export type CorsCallback<Request> = (
  request: Request,
) => PromiseLike<CorsOptions>;

export function corsHandler<Request, Response>(
  handler: HttpHandler<Request, Response>,
  options: CorsOptions | CorsCallback<HttpRequest<Request>> = {},
): HttpHandler<Request, Response | undefined> {
  return async (
    request: HttpRequest<Request>,
  ): Promise<HttpResponse<Response | undefined>> => {
    let finalOpts: Required<CorsOptions>;

    if (typeof options === 'function') {
      finalOpts = { ...defaultCorsOptions, ...(await options(request)) };
    } else {
      finalOpts = { ...defaultCorsOptions, ...options };
    }

    if (request.method === 'OPTIONS') {
      if (request.headers.get('Access-Control-Request-Method')) {
        // preflight request
        const headers = setHeaders(new HttpHeaders(), finalOpts, false);

        return {
          status: 204,
          headers,
          body: undefined,
        };
      }
    }

    const response = await handler(request);
    setHeaders(response.headers || new HttpHeaders(), finalOpts, true);

    return response;
  };
}

function setHeaders(
  headers: HttpHeaders,
  options: Required<CorsOptions>,
  basic: boolean,
): HttpHeaders {
  if (options.credentials) {
    headers.add('Access-Control-Allow-Credentials', 'true');
  }
  if (options.origin) {
    headers.add('Access-Control-Allow-Origin', options.origin);
  }
  if (options.exposeHeaders.length) {
    headers.add(
      'Access-Control-Expose-Headers',
      options.exposeHeaders.join(', '),
    );
  }
  if (!basic) {
    if (options.headers.length) {
      headers.add('Access-Control-Allow-Headers', options.headers.join(', '));
    }
    if (options.methods.length) {
      headers.add('Access-Control-Allow-Methods', options.methods.join(', '));
    }
    if (options.vary.length) {
      headers.add('Vary', options.vary.join(', '));
    } else {
      headers.add('Vary', 'Origin');
    }
  }
  return headers;
}
