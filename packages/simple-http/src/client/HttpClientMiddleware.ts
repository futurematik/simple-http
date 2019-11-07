import { HttpClient } from './HttpClient';

export interface HttpClientMiddleware {
  (client: HttpClient): HttpClient;
}
