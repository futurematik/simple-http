import { HttpServerRequest } from './HttpServerRequest';
import { HttpServerResponse } from './HttpServerResponse';

export interface HttpServer<
  Req = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Res = unknown,
  Ctx = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Query = any // eslint-disable-line @typescript-eslint/no-explicit-any
> {
  (request: HttpServerRequest<Req, Ctx, Query>): PromiseLike<
    HttpServerResponse<Res>
  >;
}
