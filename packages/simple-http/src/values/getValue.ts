import { ValueCollection } from './ValueCollection';
import { findKey } from './findKey';

export function getValue<T>(
  values: ValueCollection<T>,
  key: string,
): T | undefined {
  const actualKey = findKey(values, key);
  if (actualKey) {
    return values[actualKey];
  }
}
