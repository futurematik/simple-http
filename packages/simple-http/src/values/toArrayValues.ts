import { ValueCollection } from './ValueCollection';

export function toArrayValues<T>(
  values: ValueCollection<T | T[]>,
): ValueCollection<T[]> {
  return Object.keys(values).reduce(
    (a, x) => ({ ...a, [x]: toArrayValue(values[x]) }),
    {} as ValueCollection<T[]>,
  );
}

export function toArrayValue<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
