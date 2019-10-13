import { HttpHeaders } from './HttpHeaders';

export interface HttpResponse<Body = string | Buffer | undefined> {
  body: Body;
  headers?: HttpHeaders;
  status: number;
}
