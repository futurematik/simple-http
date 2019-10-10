import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';
import { HttpContext } from './HttpContext';
import { HttpValueCollection } from './HttpValueCollection';

export type HttpHandler<
  Request = string | Buffer | undefined,
  Response = string | Buffer | undefined,
  Context extends HttpContext = HttpContext,
  Query = HttpValueCollection
> = (
  request: HttpRequest<Request, Context, Query>,
) => PromiseLike<HttpResponse<Response>>;
