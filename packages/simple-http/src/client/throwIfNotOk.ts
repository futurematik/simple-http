import { HttpClientResponse } from './HttpClientResponse';
import { HttpError } from '../common/HttpError';

export function throwIfNotOk(response: HttpClientResponse): void {
  if (response.status < 200 || response.status >= 300) {
    throw new HttpError(response.status);
  }
}
