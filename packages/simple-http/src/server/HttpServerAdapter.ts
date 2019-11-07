import { HttpServer } from './HttpServer';

export interface HttpServerAdapter<T> {
  (server: HttpServer): T;
}
