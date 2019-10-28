import { ValueCollection } from './ValueCollection';
import { setValue } from './setValue';

export function overrideValues<T>(
  ...collections: ValueCollection<T>[]
): ValueCollection<T> {
  return collections.reduce(
    (merged, current) =>
      Object.keys(current).reduce(
        (headers, key) => setValue(headers, key, current[key]),
        merged,
      ),
    {},
  );
}
