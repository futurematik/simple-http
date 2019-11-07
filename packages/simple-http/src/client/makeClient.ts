import { HttpClient } from './HttpClient';
import { HttpClientMiddleware } from './HttpClientMiddleware';

/**
 * Apply the list of middleware to the client.
 */
export function makeClient(
  client: HttpClient,
  middleware: HttpClientMiddleware[],
): HttpClient {
  return middleware.reduce((c, m) => m(c), client);
}
