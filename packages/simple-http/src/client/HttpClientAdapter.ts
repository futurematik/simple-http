import { HttpClient } from './HttpClient';

export interface HttpClientAdapter {
  (client: HttpClient): HttpClient;
}
