import { HttpClientRequest } from './HttpClientRequest';
import { HttpClientResponse } from './HttpClientResponse';

export interface HttpClientBase {
  <Req, Res>(request: HttpClientRequest<Req>): PromiseLike<
    HttpClientResponse<Res>
  >;
}

export interface HttpClientRequestFunc<Res> {
  (client: HttpClient): PromiseLike<HttpClientResponse<Res>>;
}

export interface HttpClient extends HttpClientBase {
  <Res>(request: HttpClientRequestFunc<Res>): PromiseLike<
    HttpClientResponse<Res>
  >;
}
