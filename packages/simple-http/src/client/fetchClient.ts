import { ValueCollection } from '../values/ValueCollection';
import { HttpClient, HttpClientBase } from './HttpClient';
import { HttpClientRequest } from './HttpClientRequest';
import { HttpClientResponse } from './HttpClientResponse';
import { foldHeaders } from '../common/foldHeaders';
import { HttpValueCollection } from '../values/HttpValueCollection';
import { addValue } from '../values/addValue';
import { enhanceClient } from './enhanceClient';

export interface FetchRequestInit {
  method?: string;
  headers?: ValueCollection<string>;
  body?: string;
}

export interface FetchResponseHeaders {
  get(key: string): string | null;
  forEach(callback: (value: string, name: string) => void): void;
}

export interface FetchResponse {
  headers: FetchResponseHeaders;
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json(): Promise<any>;
  text(): Promise<string>;
}

export interface FetchLike {
  (url: string, init: FetchRequestInit): Promise<FetchResponse>;
}

export function makeFetchClientBase(fetchImpl: FetchLike): HttpClientBase {
  return async <Req, Res>(
    req: HttpClientRequest<Req>,
  ): Promise<HttpClientResponse<Res>> => {
    const { body, headers = {}, method = body ? 'POST' : 'GET', url } = req;

    if (
      typeof body !== 'undefined' &&
      typeof body !== 'string' &&
      body !== null
    ) {
      throw new Error(`expected body to be string, undefined or null`);
    }

    const response = await fetchImpl(url, {
      method,
      headers: foldHeaders(headers),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: body as any,
    });

    const responseBody = await response.text();
    let responseHeaders: HttpValueCollection = {};

    response.headers.forEach((value, name): void => {
      responseHeaders = addValue(responseHeaders, name, value);
    });

    const ret = {
      status: response.status,
      headers: responseHeaders,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: responseBody as any,
    };
    return ret;
  };
}

export function makeFetchClient(fetchImpl: FetchLike): HttpClient {
  return enhanceClient(makeFetchClientBase(fetchImpl));
}
