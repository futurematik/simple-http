import { HttpValueCollection } from './HttpValueCollection';
import { getHeaderEntry } from './getHeaderEntry';

export function setHeader(
  headers: HttpValueCollection,
  key: string,
  value: string | string[] | undefined,
): string | string[] | undefined {
  const entry = getHeaderEntry(headers, key);

  if (entry) {
    const [k, v] = entry;

    if (typeof value === 'undefined') {
      delete headers[k];
    } else {
      return (headers[k] = (Array.isArray(v) ? v : [v]).concat(value));
    }
  } else if (typeof value !== 'undefined') {
    return (headers[key] = value);
  }
}
