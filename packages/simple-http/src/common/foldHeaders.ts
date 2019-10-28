import { ValueCollection } from '../values/ValueCollection';

export function foldHeaders(
  headers: ValueCollection<string | string[]>,
): ValueCollection<string> {
  return Object.keys(headers).reduce(
    (a, x) => {
      const value = foldHeaderValue(x);
      return value ? { ...a, [x]: value } : a;
    },
    {} as ValueCollection<string>,
  );
}

export function foldHeaderValue(value: string | string[]): string | undefined {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return;
    }
    return value.join(', ');
  }
  return value;
}
