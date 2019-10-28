import { ValueCollection } from './ValueCollection';
import { findKey } from './findKey';

export function getLastValue<T>(
  values: ValueCollection<T | T[]>,
  key: string,
): T | undefined;
export function getLastValue<T>(
  values: ValueCollection<T[]>,
  key: string,
): T | undefined;
export function getLastValue<T>(
  values: ValueCollection<T | T[]>,
  key: string,
): T | undefined {
  const actualKey = findKey(values, key);
  if (actualKey) {
    const value = values[actualKey];
    return Array.isArray(value) ? value[value.length - 1] : value;
  }
}
