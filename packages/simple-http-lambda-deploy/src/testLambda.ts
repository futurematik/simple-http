import { jsonHandler, HttpResponse, HttpRequest } from '@fmtk/simple-http';
import { toAwsLambdaHandler } from '@fmtk/simple-http-lambda';

export const handler = toAwsLambdaHandler(
  jsonHandler(
    async (request: HttpRequest<{}>): Promise<HttpResponse<{}>> => {
      return {
        statusCode: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: request,
      };
    },
  ),
);
