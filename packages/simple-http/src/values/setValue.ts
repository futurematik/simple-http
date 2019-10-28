import { ValueCollection } from './ValueCollection';
import { findKey } from './findKey';

export function setValue<T>(
  values: ValueCollection<T>,
  key: string,
  value: T,
): ValueCollection<T> {
  const actualKey = findKey(values, key) || key;
  return { ...values, [actualKey]: value };
}
