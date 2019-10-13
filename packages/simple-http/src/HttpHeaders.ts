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
    if (typeof value === 'undefined') {
      delete this.values[keylc];
    } else {
      this.values[keylc] = addValue(this.values[keylc], value);
    }
    return this;
  }

  clone(): HttpHeaders {
    return new HttpHeaders(this);
  }

  default(key: string, value: string | string[]): this {
    const keylc = key.toLowerCase();
    if (!(keylc in this.values)) {
      this.values[keylc] = normaliseValue(value);
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
    return this.values[key.toLowerCase()];
  }

  multiValues(): { [key: string]: string[] } {
    return Object.entries(this.values).reduce(
      (a, [k, v]) => ({ ...a, [k]: denormaliseValue(v) }),
      {},
    );
  }

  set(key: string, value: undefined | string | string[]): this {
    const keylc = key.toLowerCase();
    if (typeof value === 'undefined') {
      delete this.values[keylc];
    } else {
      this.values[keylc] = normaliseValue(value);
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
  value: string | string[],
): HttpValueCollection {
  const keylcase = key.toLowerCase();
  const existing = values[keylcase];

  return {
    ...values,
    [keylcase]: addValue(existing, value),
  };
}

export function addValue(
  existing: undefined | string | string[],
  value: string | string[],
): string | string[] {
  if (!existing) {
    return normaliseValue(value);
  } else if (Array.isArray(existing)) {
    return normaliseValue(existing.concat(value));
  } else {
    return [existing, ...denormaliseValue(value)];
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

export function normaliseValue(value: string | string[]): string | string[] {
  return Array.isArray(value) ? (value.length === 1 ? value[0] : value) : value;
}

export function denormaliseValue(value: string | string[]): string[] {
  return Array.isArray(value) ? value : [value];
}
