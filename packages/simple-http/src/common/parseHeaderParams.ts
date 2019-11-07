import { HttpValueCollection } from '../values/HttpValueCollection';

/**
 * Parse a header into its value and params.
 */
export function parseHeaderParams(
  str: string | undefined,
): [string | undefined, HttpValueCollection] {
  if (!str) {
    return [undefined, {}];
  }
  const [value, ...params] = str.split(';');
  return [
    value.trim(),
    params.reduce((a, x) => {
      const sepIndex = x.indexOf('=');
      if (sepIndex < 0) {
        // skip invalid input
        return a;
      }
      const k = x.substring(0, sepIndex).trim();
      const v = x.substring(sepIndex + 1, x.length).trim();
      return { ...a, [k]: v };
    }, {}),
  ];
}
