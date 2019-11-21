import {
  jsonServer,
  corsServer,
  HttpServerResponse,
  HttpServerRequest,
  getRequestUrl,
  makeServer,
  traceServer,
  makeWebSocketServer,
  traceWebSocket,
} from '@fmtk/simple-http';
import { awsLambda, lambdaWebSocket } from '@fmtk/simple-http-lambda';

export const handler = makeServer(
  async (request: HttpServerRequest): Promise<HttpServerResponse> => {
    return {
      status: 200,
      body: {
        request,
        env: Object.keys(process.env),
        url: getRequestUrl(request),
      },
    };
  },
  [traceServer({ trace: console.log }), corsServer(), jsonServer()],
  awsLambda(),
);

export const socketHandler = makeWebSocketServer(
  {
    async connect(conn): Promise<void> {
      await conn.send(conn.id, { message: 'hello', id: conn.id });
    },

    async message(conn, message): Promise<void> {
      if (message && message.message === 'send') {
        await conn.send(message.to, message);
      }
    },
  },
  [traceWebSocket({ trace: console.log })],
  lambdaWebSocket(),
);
