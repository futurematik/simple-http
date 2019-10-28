import { ValueCollection } from '../values/ValueCollection';
import { HttpValueCollection } from '../values/HttpValueCollection';
import { HttpServerRequest } from './HttpServerRequest';
import { HttpServerResponse } from './HttpServerResponse';

export interface HttpServer<
  Request = string | Buffer | undefined,
  Response = string | Buffer | undefined,
  Context extends ValueCollection<unknown> = ValueCollection<unknown>,
  Query = HttpValueCollection
> {
  (request: HttpServerRequest<Request, Context, Query>): PromiseLike<
    HttpServerResponse<Response>
  >;
}
