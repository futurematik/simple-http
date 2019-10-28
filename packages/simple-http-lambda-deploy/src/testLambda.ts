import {
  jsonHandler,
  corsHandler,
  HttpServerResponse,
  HttpServerRequest,
  getRequestUrl,
} from '@fmtk/simple-http';
import { toAwsLambdaHandler } from '@fmtk/simple-http-lambda';

export const handler = toAwsLambdaHandler(
  corsHandler(
    jsonHandler(
      async (
        request: HttpServerRequest<{}>,
      ): Promise<HttpServerResponse<{}>> => {
        return {
          status: 200,
          body: {
            request,
            env: Object.keys(process.env),
            url: getRequestUrl(request),
          },
        };
      },
    ),
  ),
);
