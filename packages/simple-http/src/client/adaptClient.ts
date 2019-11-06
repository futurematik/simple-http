import { HttpClient } from './HttpClient';
import { HttpClientAdapter } from './HttpClientAdapter';

/**
 * Apply the list of adapters to the client.
 */
export function adaptClient(
  client: HttpClient,
  ...adapters: HttpClientAdapter[]
): HttpClient {
  return adapters.reduce((a, x) => x(a), client);
}
