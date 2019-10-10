import { jsonHandler, HttpResponse, HttpRequest } from '@fmtk/simple-http';
import { getModulePath } from '@fmtk/package-path';
import { toAwsLambdaHandler } from '.';

export const source = getModulePath(__filename);

export const testLambda = toAwsLambdaHandler(
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
