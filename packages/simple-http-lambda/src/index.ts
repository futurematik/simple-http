import { HttpHandler, HttpValueCollection } from '@fmtk/simple-http';
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';

export function toAwsLambdaHandler(
  handler: HttpHandler,
): APIGatewayProxyHandler {
  return async function(
    event: APIGatewayProxyEvent,
  ): Promise<APIGatewayProxyResult> {
    const requestBody =
      event.body &&
      (event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body);

    try {
      const result = await handler({
        body: requestBody || undefined,
        context: {
          pathParameters: event.pathParameters,
        },
        headers: normaliseValues(event.multiValueHeaders),
        method: event.httpMethod,
        path: event.path,
        query: normaliseValues(event.multiValueQueryStringParameters),
      });

      let responseBody: string;
      let isBase64Encoded: boolean;

      if (result.body === null || typeof result.body === 'undefined') {
        responseBody = '';
        isBase64Encoded = false;
      }
      if (typeof result.body === 'string') {
        responseBody = result.body;
        isBase64Encoded = false;
      } else if (Buffer.isBuffer(result.body)) {
        responseBody = result.body.toString('base64');
        isBase64Encoded = true;
      } else {
        throw new TypeError(
          `expected response body to be a string or a buffer`,
        );
      }

      return {
        body: responseBody,
        isBase64Encoded,
        multiValueHeaders: Object.entries(result.headers).reduce(
          (a, [k, v]) => ({ ...a, [k]: Array.isArray(v) ? v : [v] }),
          {},
        ),
        statusCode: result.statusCode,
      };
    } catch (e) {
      console.error(e);
      return {
        statusCode: 500,
        body: 'HTTP Server Error 500',
        headers: {
          'Content-Type': 'text/plain',
        },
      };
    }
  };
}

function normaliseValues(
  values: HttpValueCollection | null | undefined,
): HttpValueCollection {
  if (!values) {
    return {};
  }
  return Object.entries(values).reduce(
    (a, [k, v]) =>
      v.length === 0 ? a : { ...a, [k]: v.length === 1 ? v[0] : v },
    {},
  );
}
