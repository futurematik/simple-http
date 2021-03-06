import { HttpServer } from './HttpServer';
import { HttpServerMiddleware } from './HttpServerMiddleware';
import { HttpServerRequest } from './HttpServerRequest';
import { HttpServerResponse } from './HttpServerResponse';
import { getLastValue } from '../values/getLastValue';
import { HttpValueCollection } from '../values/HttpValueCollection';
import { overrideValues } from '../values/overrideValues';

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

export function corsServer(
  options: CorsOptions | CorsCallback<HttpServerRequest> = {},
): HttpServerMiddleware {
  return (handler: HttpServer): HttpServer => {
    return async (request: HttpServerRequest): Promise<HttpServerResponse> => {
      let finalOpts: Required<CorsOptions>;

      if (typeof options === 'function') {
        finalOpts = { ...defaultCorsOptions, ...(await options(request)) };
      } else {
        finalOpts = { ...defaultCorsOptions, ...options };
      }

      if (request.method === 'OPTIONS') {
        if (getLastValue(request.headers, 'Access-Control-Request-Method')) {
          // preflight request
          return {
            status: 204,
            headers: makeHeaders(finalOpts, false),
            body: undefined,
          };
        }
      }

      const response = await handler(request);

      return {
        ...response,
        headers: overrideValues(
          response.headers || {},
          makeHeaders(finalOpts, true),
        ),
      };
    };
  };
}

function makeHeaders(
  options: Required<CorsOptions>,
  basic: boolean,
): HttpValueCollection {
  const headers: HttpValueCollection = {};

  if (options.credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }
  if (options.origin) {
    headers['Access-Control-Allow-Origin'] = options.origin;
  }
  if (options.exposeHeaders.length) {
    headers['Access-Control-Expose-Headers'] = options.exposeHeaders.join(', ');
  }
  if (!basic) {
    if (options.headers.length) {
      headers['Access-Control-Allow-Headers'] = options.headers.join(', ');
    }
    if (options.methods.length) {
      headers['Access-Control-Allow-Methods'] = options.methods.join(', ');
    }
    if (options.vary.length) {
      headers['Vary'] = options.vary.join(', ');
    } else {
      headers['Vary'] = 'Origin';
    }
  }
  return headers;
}
