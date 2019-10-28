import { HttpClientRequest } from './HttpClientRequest';
import { HttpClientResponse } from './HttpClientResponse';

export interface HttpClient {
  <Req, Res>(request: HttpClientRequest<Req>): Promise<HttpClientResponse<Res>>;
}
