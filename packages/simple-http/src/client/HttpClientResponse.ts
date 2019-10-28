import { HttpValueCollection } from '../values/HttpValueCollection';

export interface HttpClientResponse<T = string> {
  status: number;
  headers: HttpValueCollection;
  body?: T;
}
