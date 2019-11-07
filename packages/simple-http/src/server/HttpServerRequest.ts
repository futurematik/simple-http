import { HttpValueCollection } from '../values/HttpValueCollection';

export interface HttpServerRequest<Body = unknown, Ctx = unknown, Q = unknown> {
  body: Body;
  context: Ctx;
  headers: HttpValueCollection;
  method: string;
  path: string;
  query?: Q;
  rawQuery?: string;
  resourcePath?: string;
}
