import { jsonHandler, HttpResponse, HttpRequest } from '@fmtk/simple-http';
import { toAwsLambdaHandler } from '@fmtk/simple-http-lambda';

export const handler = toAwsLambdaHandler(
  jsonHandler(
    async (request: HttpRequest<{}>): Promise<HttpResponse<{}>> => {
      return {
        status: 200,
        body: request,
      };
    },
  ),
);
