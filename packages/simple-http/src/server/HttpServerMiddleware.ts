import { HttpServer } from './HttpServer';

export interface HttpServerMiddleware {
  (server: HttpServer): HttpServer;
}
