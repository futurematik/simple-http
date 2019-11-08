import {
  jsonServer,
  corsServer,
  HttpServerResponse,
  HttpServerRequest,
  getRequestUrl,
  makeServer,
  traceServer,
} from '@fmtk/simple-http';
import { awsLambda } from '@fmtk/simple-http-lambda';

export const handler = makeServer(
  async (request: HttpServerRequest): Promise<HttpServerResponse> => {
    return {
      status: 200,
      body: {
        request,
        env: Object.keys(process.env),
        url: getRequestUrl(request),
      },
    };
  },
  [traceServer({ trace: console.log }), corsServer(), jsonServer()],
  awsLambda(),
);
