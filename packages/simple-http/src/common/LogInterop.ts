export interface LogInfo {
  msg?: string;
  [other: string]: unknown;
}

export interface LogFn {
  (details: LogInfo): void;
}

export interface Logger {
  trace: LogFn;
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
}

const noop = (): void => {};

export function stubLogger(): Logger {
  return {
    trace: noop,
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
  };
}
