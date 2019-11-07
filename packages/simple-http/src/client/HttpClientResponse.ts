import { HttpValueCollection } from '../values/HttpValueCollection';

export interface HttpClientResponse<T = unknown> {
  status: number;
  headers: HttpValueCollection;
  body?: T;
}
