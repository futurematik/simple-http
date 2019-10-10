import { HttpResponse } from '@fmtk/simple-http';
import { getModulePath } from '@fmtk/package-path';
import { toAwsLambdaHandler } from '.';

export const source = getModulePath(__filename);

export const testLambda = toAwsLambdaHandler(
  async (request): Promise<HttpResponse> => {
    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        request,
      }),
    };
  },
);
