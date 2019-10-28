import { HttpServer, fromArrayValues, toArrayValues } from '@fmtk/simple-http';
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

export function toAwsLambdaHandler(
  handler: HttpServer,
): APIGatewayProxyHandler {
  return async function(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    const requestBody =
      event.body &&
      (event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body);

    try {
      const response = await handler({
        body: requestBody || undefined,
        context: {
          pathParameters: event.pathParameters,
          aws: { event, context },
        },
        headers: fromArrayValues(event.multiValueHeaders),
        method: event.httpMethod,
        path: event.requestContext.path,
        query: fromArrayValues(event.multiValueQueryStringParameters || {}),
        resourcePath: event.path,
      });

      let responseBody: string;
      let isBase64Encoded: boolean;

      if (response.body === null || typeof response.body === 'undefined') {
        responseBody = '';
        isBase64Encoded = false;
      } else if (typeof response.body === 'string') {
        responseBody = response.body;
        isBase64Encoded = false;
      } else if (Buffer.isBuffer(response.body)) {
        responseBody = response.body.toString('base64');
        isBase64Encoded = true;
      } else {
        throw new TypeError(
          `expected response body to be a string or a buffer`,
        );
      }

      return {
        body: responseBody,
        isBase64Encoded,
        multiValueHeaders: toArrayValues(response.headers || {}),
        statusCode: response.status,
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
