import { HttpValueCollection } from './HttpValueCollection';
import { getHeaderEntry } from './getHeaderEntry';

export function getHeader(
  headers: HttpValueCollection,
  key: string,
): string | string[] | undefined {
  const [, v] = getHeaderEntry(headers, key) || [];
  return v;
}
