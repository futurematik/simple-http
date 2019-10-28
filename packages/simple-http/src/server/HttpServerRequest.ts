import { HttpValueCollection } from '../values/HttpValueCollection';
import { ValueCollection } from '../values/ValueCollection';

export interface HttpServerRequest<
  Body = string | Buffer | undefined,
  Context extends ValueCollection<unknown> = ValueCollection<unknown>,
  Query = HttpValueCollection
> {
  body: Body;
  context: Context;
  headers: HttpValueCollection;
  method: string;
  path: string;
  query?: Query;
  rawQuery?: string;
  resourcePath?: string;
}
