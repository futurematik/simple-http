import { ValueCollection } from '../values/ValueCollection';
import { HttpClient, HttpClientBase } from './HttpClient';
import { HttpClientRequest } from './HttpClientRequest';
import { HttpClientResponse } from './HttpClientResponse';
import { getLastValue } from '../values/getLastValue';
import { HttpContentType } from '../common/HttpContentType';
import { foldHeaders } from '../common/foldHeaders';
import { setValue } from '../values/setValue';
import { HttpValueCollection } from '../values/HttpValueCollection';
import { addValue } from '../values/addValue';
import { enhanceClient } from './enhanceClient';

export interface FetchRequestInit {
  method?: string;
  headers?: ValueCollection<string>;
  body?: string | Buffer;
}

export interface FetchResponseHeaders {
  get(key: string): string | null;
  forEach(callback: (value: string, name: string) => void): void;
}

export interface FetchResponse {
  status: number;
  headers: FetchResponseHeaders;
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
    const { url, body, method = body ? 'POST' : 'GET' } = req;
    let headers = req.headers || {};
    let encodedBody: string | Buffer | undefined;

    if (
      typeof body === 'undefined' ||
      typeof body === 'string' ||
      Buffer.isBuffer(body)
    ) {
      encodedBody = body || undefined;
    } else {
      const [contentType] = (
        getLastValue(headers, 'content-type') || HttpContentType.Json
      ).split(';');

      switch (contentType) {
        case HttpContentType.Json:
          encodedBody = JSON.stringify(body);
          break;

        case HttpContentType.Form:
          encodedBody = new URLSearchParams(body as {}).toString();
          break;

        default:
          throw new Error(
            `don't know how to encode content-type: ${contentType}`,
          );
      }

      headers = setValue(headers, 'content-type', contentType);
    }

    const response = await fetchImpl(url, {
      method,
      headers: foldHeaders(headers),
      body: encodedBody,
    });

    let responseBody: Res;
    let responseHeaders: HttpValueCollection = {};

    response.headers.forEach((value, name): void => {
      responseHeaders = addValue(responseHeaders, name, value);
    });

    const [responseType] = (
      getLastValue(responseHeaders, 'content-type') || ''
    ).split(';');

    if (responseType === HttpContentType.Json) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responseBody = (await response.json()) as any;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responseBody = (await response.text()) as any;
    }

    const ret = {
      status: response.status,
      headers: responseHeaders,
      body: responseBody,
    };
    return ret;
  };
}

export function makeFetchClient(fetchImpl: FetchLike): HttpClient {
  return enhanceClient(makeFetchClientBase(fetchImpl));
}
