import { HttpServerRequest } from './HttpServerRequest';
import { HttpServerResponse } from './HttpServerResponse';

export interface HttpServer<
  Req = unknown,
  Res = unknown,
  Ctx = unknown,
  Query = unknown
> {
  (request: HttpServerRequest<Req, Ctx, Query>): PromiseLike<
    HttpServerResponse<Res>
  >;
}
