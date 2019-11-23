import {
  HttpServer,
  HttpServerAdapter,
  fromArrayValues,
  toArrayValues,
  HttpServerResponse,
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
  return (handler: HttpServer): AsyncAPIGatewayProxyHandler => {
    const invoke = invokeHandlerFromLambda(handler);

    return async function(
      event: APIGatewayProxyEvent,
      context: Context,
    ): Promise<APIGatewayProxyResult> {
      try {
        const response = await invoke(event, context);
        return convertToLambdaResponse(response);
      } catch (e) {
        return {
          statusCode: 500,
          body: 'HTTP Server Error 500',
          headers: {
            'Content-Type': 'text/plain',
          },
        };
      }
    };
  };
}

export function invokeHandlerFromLambda<Req, Res>(
  handler: HttpServer<Req, Res>,
): AsyncLambdaHandler<APIGatewayProxyEvent, HttpServerResponse<Res>> {
  return async (event, context): Promise<HttpServerResponse<Res>> => {
    const requestBody =
      event.body &&
      (event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body);

    return await handler({
      body: ((requestBody || undefined) as unknown) as Req,
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
  };
}

export function convertToLambdaResponse(
  response: HttpServerResponse,
): APIGatewayProxyResult {
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
    throw new TypeError(`expected response body to be a string or a buffer`);
  }

  return {
    body: responseBody,
    isBase64Encoded,
    multiValueHeaders: toArrayValues(response.headers || {}),
    statusCode: response.status,
  };
}
