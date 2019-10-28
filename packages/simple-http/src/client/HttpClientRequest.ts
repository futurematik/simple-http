import { HttpValueCollection } from '../values/HttpValueCollection';

export interface HttpClientRequest<T = string> {
  url: string;
  method?: string;
  headers?: HttpValueCollection;
  body?: T;
}
