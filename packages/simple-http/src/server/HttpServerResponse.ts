import { HttpValueCollection } from '../values/HttpValueCollection';

export interface HttpServerResponse<Body = string | Buffer | undefined> {
  body: Body;
  headers?: HttpValueCollection;
  status: number;
}
