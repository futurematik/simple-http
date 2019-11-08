import 'jest';
import {
  FetchRequestInit,
  FetchResponse,
  FetchResponseHeaders,
  makeFetchClient,
} from './fetchClient';
import { ValueCollection } from '../values/ValueCollection';

class FakeFetchHeaders implements FetchResponseHeaders {
  constructor(private readonly headers: ValueCollection<string>) {}

  get(key: string): string | null {
    return this.headers[key] || null;
  }

  forEach(callback: (value: string, name: string) => void): void {
    for (const k in this.headers) {
      callback(this.headers[k], k);
    }
  }
}

describe('fetchClient', () => {
  it('processes a request properly', async () => {
    const fetch = jest.fn(
      async (url: string, init: FetchRequestInit): Promise<FetchResponse> => {
        return {
          status: 200,
          text: async () => 'body goes here',
          json: async () => {
            throw new Error(`didn't json() expect to be called`);
          },
          headers: new FakeFetchHeaders({
            'x-header-1': 'one',
            'x-header-2': 'two',
          }),
        };
      },
    );

    const client = makeFetchClient(fetch);

    const response = await client({
      url: 'http://example.com',
      headers: { 'x-req-head-1': 'uno', 'x-req-head-2': 'dos' },
      body: 'request body here',
      method: 'POST',
    });

    expect(fetch.mock.calls).toHaveLength(1);

    expect(fetch.mock.calls[0]).toEqual([
      'http://example.com',
      {
        headers: { 'x-req-head-1': 'uno', 'x-req-head-2': 'dos' },
        body: 'request body here',
        method: 'POST',
      },
    ]);

    expect(response).toEqual({
      status: 200,
      body: 'body goes here',
      headers: {
        'x-header-1': 'one',
        'x-header-2': 'two',
      },
    });
  });
});
