import { HttpValueCollection } from '../values/HttpValueCollection';

export const HttpErrorName = 'HttpError';

export interface HttpErrorDetails {
  readonly status: number;
  readonly body?: unknown;
  readonly headers?: HttpValueCollection;
}

export class HttpError extends Error implements HttpErrorDetails {
  public static fromResponse(response: HttpErrorDetails): HttpError {
    return new HttpError(response.status, response.body);
  }

  public static is(e: unknown): e is HttpError {
    return (
      e instanceof HttpError ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e instanceof Error && (e as any).name === HttpErrorName)
    );
  }

  public readonly name = HttpErrorName;

  constructor(
    public readonly status: number,
    public readonly body?: unknown,
    public readonly headers?: HttpValueCollection,
  ) {
    super(`HTTP error ${status}`);
  }
}
