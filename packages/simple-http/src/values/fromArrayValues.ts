import { ValueCollection } from './ValueCollection';

export function fromArrayValues<T>(
  values: ValueCollection<T[]>,
): ValueCollection<T | T[]> {
  return Object.keys(values).reduce(
    (a, x) => {
      const v = fromArrayValue(values[x]);
      return v ? { ...a, [x]: v } : a;
    },
    {} as ValueCollection<T | T[]>,
  );
}

export function fromArrayValue<T>(value: T[]): T | T[] | undefined {
  if (value.length > 1) {
    return value;
  }
  if (value.length === 1) {
    return value[0];
  }
}
