import { HttpValueCollection } from './HttpValueCollection';
import { HttpContext } from './HttpContext';

export interface HttpRequest<
  Body = string | Buffer | undefined,
  Context extends HttpContext = HttpContext,
  Query = HttpValueCollection
> {
  body: Body;
  context: Context;
  headers: HttpValueCollection;
  method: string;
  path: string;
  query?: Query;
  rawQuery?: string;
}
