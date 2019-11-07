import { HttpValueCollection } from '../values/HttpValueCollection';

export interface HttpServerResponse<Body = unknown> {
  body: Body;
  headers?: HttpValueCollection;
  status: number;
}
