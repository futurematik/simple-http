import { ValueCollection } from './ValueCollection';

export function findKey<T>(
  headers: ValueCollection<T>,
  key: string,
): string | undefined {
  key = key.toLowerCase();

  for (const header in headers) {
    if (key === header.toLowerCase()) {
      return header;
    }
  }
}
