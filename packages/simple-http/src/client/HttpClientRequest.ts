import { HttpValueCollection } from '../values/HttpValueCollection';

export interface HttpClientRequest<T = unknown> {
  url: string;
  method?: string;
  headers?: HttpValueCollection;
  body?: T;
}
