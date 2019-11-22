import { ApiGatewayManagementApi } from 'aws-sdk';
import { Context } from 'aws-lambda';
import {
  WebSocketServer,
  ValueCollection,
  WebSocketConnection,
  WebSocketServerAdapter,
} from '@fmtk/simple-http';

export interface LambdaIdentityContext {
  accessKey: string | null;
  accountId: string | null;
  apiKey: string | null;
  apiKeyId: string | null;
  caller: string | null;
  cognitoAuthenticationProvider: string | null;
  cognitoAuthenticationType: string | null;
  cognitoIdentityId: string | null;
  cognitoIdentityPoolId: string | null;
  sourceIp: string;
  user: string | null;
  userAgent: string | null;
  userArn: string | null;
}

export type LambdaWebSocketEventType = 'CONNECT' | 'MESSAGE' | 'DISCONNECT';

export interface LambdaWebSocketRequestContext {
  apiId: string;
  authorizer?: ValueCollection<string>;
  connectedAt: number;
  connectionId: string;
  domainName: string;
  eventType: LambdaWebSocketEventType;
  extendedRequestId: string;
  identity: LambdaIdentityContext;
  messageDirection: 'IN' | 'OUT';
  messageId: string | null;
  requestId: string;
  requestTime: string;
  requestTimeEpoch: number;
  routeKey: string;
  stage: string;
}

export interface LambdaWebSocketConnectEvent {
  headers: ValueCollection<string>;
  multiValueHeaders: ValueCollection<string[]>;
  requestContext: LambdaWebSocketRequestContext;
  isBase64Encoded: boolean;
}

export interface LambdaWebSocketMessageEvent {
  requestContext: LambdaWebSocketRequestContext;
  body?: string;
  isBase64Encoded: boolean;
}

export type LambdaWebSocketEvent =
  | LambdaWebSocketConnectEvent
  | LambdaWebSocketMessageEvent;

export function isConnectEvent(
  event: LambdaWebSocketEvent,
): event is LambdaWebSocketConnectEvent {
  return event.requestContext.eventType === 'CONNECT';
}

export function isDisconnectEvent(
  event: LambdaWebSocketEvent,
): event is LambdaWebSocketConnectEvent {
  return event.requestContext.eventType === 'DISCONNECT';
}

export function isMessageEvent(
  event: LambdaWebSocketEvent,
): event is LambdaWebSocketMessageEvent {
  return event.requestContext.eventType === 'MESSAGE';
}

export interface LambdaWebSocketResponse {
  statusCode: number;
  body?: string;
}

export interface LambdaWebSocket {
  (
    event: LambdaWebSocketConnectEvent | LambdaWebSocketMessageEvent,
    context: Context,
  ): PromiseLike<LambdaWebSocketResponse | undefined>;
}

export function lambdaWebSocket(): WebSocketServerAdapter<LambdaWebSocket> {
  return (server: WebSocketServer): LambdaWebSocket => {
    return async (
      event,
      context,
    ): Promise<LambdaWebSocketResponse | undefined> => {
      let apigw: ApiGatewayManagementApi | undefined;
      const connectionId = event.requestContext.connectionId;

      const response: LambdaWebSocketResponse = {
        statusCode: 200,
      };

      const conn: WebSocketConnection = {
        id: connectionId,

        ctx: {
          auth: event.requestContext.authorizer,
          aws: { event, context },
        },

        async send(id, message): Promise<void> {
          const messageStr = JSON.stringify(message);

          if (id === connectionId) {
            // Returning a body from the MESSAGE handler is fastest way to send
            // message to current connection.
            // This won't work on CONNECT but there is no way to send a message
            // from there because the connection is not fully established.
            response.body = messageStr;
          } else {
            if (!apigw) {
              apigw = new ApiGatewayManagementApi({
                apiVersion: '2018-11-29',
                endpoint:
                  event.requestContext.domainName +
                  '/' +
                  event.requestContext.stage,
              });
            }
            await apigw
              .postToConnection({
                ConnectionId: id,
                Data: messageStr,
              })
              .promise();
          }
        },
      };

      if (isConnectEvent(event)) {
        if (server.connect) {
          await server.connect(conn);
        }
      } else if (isDisconnectEvent(event)) {
        if (server.disconnect) {
          await server.disconnect(conn);
        }
      } else if (isMessageEvent(event)) {
        if (server.message) {
          await server.message(conn, event.body && JSON.parse(event.body));
        }
      }

      return response;
    };
  };
}
