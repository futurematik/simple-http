import {
  jsonHandler,
  HttpResponse,
  HttpRequest,
  corsHandler,
} from '@fmtk/simple-http';
import { toAwsLambdaHandler } from '@fmtk/simple-http-lambda';

export const handler = toAwsLambdaHandler(
  corsHandler(
    jsonHandler(
      async (request: HttpRequest<{}>): Promise<HttpResponse<{}>> => {
        return {
          status: 200,
          body: request,
        };
      },
    ),
  ),
);
