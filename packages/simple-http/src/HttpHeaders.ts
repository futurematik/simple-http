import { HttpValueCollection } from './HttpValueCollection';

export class HttpHeaders {
  public static union(
    ...headers: (HttpHeaders | HttpValueCollection | undefined)[]
  ): HttpHeaders {
    return entries(...headers).reduce(
      (a, [k, v]) => a.add(k, v),
      new HttpHeaders(),
    );
  }

  public static defaults(
    ...headers: (HttpHeaders | HttpValueCollection | undefined)[]
  ): HttpHeaders {
    return entries(...headers).reduce(
      (a, [k, v]) => a.set(k, v),
      new HttpHeaders(),
    );
  }

  public readonly values: HttpValueCollection;

  constructor(values: HttpValueCollection | HttpHeaders = {}) {
    if (values instanceof HttpHeaders) {
      this.values = { ...values.values };
    } else {
      this.values = Object.entries(values).reduce(
        (a, [k, v]) => setValue(a, k, v),
        {},
      );
    }
  }

  add(key: string, value: undefined | string | string[]): this {
    const keylc = key.toLowerCase();
    const values = addValue(this.values[keylc], value);

    if (typeof values === 'undefined') {
      delete this.values[keylc];
    } else {
      this.values[keylc] = values;
    }
    return this;
  }

  clone(): HttpHeaders {
    return new HttpHeaders(this);
  }

  default(key: string, value: string | string[]): this {
    const keylc = key.toLowerCase();
    const norm = normaliseValue(value);

    if (!norm) {
      // do this check first so it doesn't depend on whether value is present
      throw new TypeError(`can't default to empty header`);
    }

    if (!(keylc in this.values)) {
      this.values[keylc] = norm;
    }
    return this;
  }

  defaults(values: HttpValueCollection): this {
    for (const [k, v] of Object.entries(values)) {
      this.default(k, v);
    }
    return this;
  }

  get(key: string): undefined | string | string[] {
    return normaliseValue(this.values[key.toLowerCase()]);
  }

  multiValues(): { [key: string]: string[] } {
    return Object.entries(this.values).reduce(
      (a, [k, v]) => ({ ...a, [k]: denormaliseValue(v) }),
      {},
    );
  }

  set(key: string, value: undefined | string | string[]): this {
    const keylc = key.toLowerCase();
    const norm = normaliseValue(value);

    if (typeof norm === 'undefined') {
      delete this.values[keylc];
    } else {
      this.values[keylc] = norm;
    }
    return this;
  }

  toJSON(): {} {
    return this.values;
  }
}

export function setValue(
  values: HttpValueCollection,
  key: string,
  value: string | string[] | undefined,
): HttpValueCollection {
  const keylcase = key.toLowerCase();
  const norm = normaliseValue(value);

  if (norm) {
    return {
      ...values,
      [keylcase]: norm,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [keylcase]: except, ...rest } = values;
  return rest;
}

export function addValue(
  existing: undefined | string | string[],
  value: string | string[] | undefined,
): string | string[] | undefined {
  const norm = normaliseValue(value);

  if (!norm) {
    return normaliseValue(existing);
  }
  if (!existing) {
    return normaliseValue(value);
  } else if (Array.isArray(existing)) {
    return normaliseValue(existing.concat(norm));
  } else {
    return [existing, ...denormaliseValue(norm)];
  }
}

export function values(
  headers: HttpValueCollection | HttpHeaders,
): HttpValueCollection {
  if (headers instanceof HttpHeaders) {
    return headers.values;
  } else {
    return headers;
  }
}

export function entries(
  ...headers: (HttpValueCollection | HttpHeaders | undefined)[]
): [string, string | string[]][] {
  return headers.reduce(
    (a, x) => (x ? [...a, ...Object.entries(values(x))] : a),
    [] as [string, string | string[]][],
  );
}

export function normaliseValue(
  value: string | string[] | undefined,
): string | string[] | undefined {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return;
    }
    if (value.length === 1) {
      return value[0];
    }
    return value;
  }
  if (value) {
    return value;
  }
}

export function denormaliseValue(
  value: string | string[] | undefined,
): string[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value) {
    return [value];
  }
  return [];
}
