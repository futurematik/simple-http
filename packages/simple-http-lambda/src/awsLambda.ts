import {
  HttpServer,
  HttpServerAdapter,
  fromArrayValues,
  toArrayValues,
} from '@fmtk/simple-http';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncLambdaHandler<TEvent = any, TResult = any> = (
  event: TEvent,
  context: Context,
) => PromiseLike<TResult>;

export type AsyncAPIGatewayProxyHandler = AsyncLambdaHandler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>;

export function awsLambda(): HttpServerAdapter<AsyncAPIGatewayProxyHandler> {
  return (handler: HttpServer): AsyncAPIGatewayProxyHandler =>
    async function(
      event: APIGatewayProxyEvent,
      context: Context,
    ): Promise<APIGatewayProxyResult> {
      const requestBody =
        event.body &&
        (event.isBase64Encoded
          ? Buffer.from(event.body, 'base64')
          : event.body);

      try {
        const response = await handler({
          body: requestBody || undefined,
          context: {
            auth: event.requestContext.authorizer,
            aws: { event, context },
            pathParameters: event.pathParameters,
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
