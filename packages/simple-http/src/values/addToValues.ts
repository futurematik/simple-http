export function addToValues<T>(values: T[] | T | undefined, value: T): T[] | T {
  if (values) {
    if (Array.isArray(values)) {
      return values.concat(value);
    }
    return [values, value];
  }
  return value;
}
