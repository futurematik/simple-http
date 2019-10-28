import { HttpServerRequest } from './HttpServerRequest';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getValue } from '../values/getValue';

export function getRequestUrl(request: HttpServerRequest<any>): URL {
  const proto = getValue(request.headers, 'x-forwarded-proto') || 'https';
  const host = getValue(request.headers, 'host');
  return new URL(`${proto}://${host}${request.path}`);
}
