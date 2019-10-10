import path from 'path';
import { HttpResponse } from '@fmtk/simple-http';
import { toAwsLambdaHandler } from '.';

export const source = {
  module: path.resolve(__dirname, '../'),
  file: path.relative(path.resolve(__dirname, '../'), __filename),
};

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
