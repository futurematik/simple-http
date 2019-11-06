import {
  HttpClientBase,
  HttpClient,
  HttpClientRequestFunc,
} from './HttpClient';
import { HttpClientRequest } from './HttpClientRequest';
import { HttpClientResponse } from './HttpClientResponse';

/**
 * Convert a HttpClientBase into a HttpClient.
 */
export function enhanceClient(client: HttpClientBase): HttpClient {
  async function enhanced<Req, Res>(
    request: HttpClientRequest<Req>,
  ): Promise<HttpClientResponse<Res>>;
  async function enhanced<Res>(
    request: HttpClientRequestFunc<Res>,
  ): Promise<HttpClientResponse<Res>>;
  async function enhanced<Req, Res>(
    request: HttpClientRequest<Req> | HttpClientRequestFunc<Res>,
  ): Promise<HttpClientResponse<Res>> {
    if (typeof request === 'function') {
      return await request(enhanced);
    }
    return client(request);
  }
  return enhanced;
}
