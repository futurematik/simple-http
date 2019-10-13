import { HttpValueCollection } from './HttpValueCollection';
import { HttpContext } from './HttpContext';
import { HttpHeaders } from './HttpHeaders';

export interface HttpRequest<
  Body = string | Buffer | undefined,
  Context extends HttpContext = HttpContext,
  Query = HttpValueCollection
> {
  body: Body;
  context: Context;
  headers: HttpHeaders;
  method: string;
  path: string;
  query?: Query;
  rawQuery?: string;
}
