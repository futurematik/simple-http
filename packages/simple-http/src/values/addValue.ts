import { ValueCollection } from './ValueCollection';
import { findKey } from './findKey';

import { addToValues } from './addToValues';

export function addValue<T>(
  values: ValueCollection<T[]>,
  key: string,
  value: T,
): ValueCollection<T[]>;
export function addValue<T>(
  values: ValueCollection<T | T[]>,
  key: string,
  value: T,
): ValueCollection<T | T[]>;
export function addValue<T>(
  values: ValueCollection<T | T[]>,
  key: string,
  value: T,
): ValueCollection<T | T[]> {
  const actualKey = findKey(values, key) || key;
  return { ...values, [actualKey]: addToValues(values[actualKey], value) };
}
