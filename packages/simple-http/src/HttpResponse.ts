import { HttpValueCollection } from './HttpValueCollection';

export interface HttpResponse<Body = string | Buffer | undefined> {
  body: Body;
  headers: HttpValueCollection;
  statusCode: number;
}
