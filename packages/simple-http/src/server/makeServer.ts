import { HttpServer } from './HttpServer';
import { HttpServerMiddleware } from './HttpServerMiddleware';
import { HttpServerAdapter } from './HttpServerAdapter';

export function makeServer<T>(
  handler: HttpServer,
  middleware: HttpServerMiddleware[],
  adapter: HttpServerAdapter<T>,
): T;
export function makeServer<T extends HttpServer>(
  handler: T,
  middleware: HttpServerMiddleware[],
): T;
export function makeServer<T>(
  handler: HttpServer,
  middleware: HttpServerMiddleware[],
  adapter?: HttpServerAdapter<T>,
): T | HttpServer {
  const withMiddleware = middleware.reduce((srv, mdw) => mdw(srv), handler);

  if (adapter) {
    return adapter(withMiddleware);
  }
  return withMiddleware;
}
