import { HttpValueCollection } from './HttpValueCollection';

export function getHeaderEntry(
  headers: HttpValueCollection,
  key: string,
): [string, string | string[]] | undefined {
  if (key in headers) {
    return [key, headers[key]];
  }
  const lcaseKey = key.toLowerCase();

  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() === lcaseKey) {
      return [k, v];
    }
  }
}
