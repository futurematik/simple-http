import { WebSocketServer } from './WebSocketServer';
import { WebSocketServerAdapter } from './WebSocketServerAdapter';
import { WebSocketMiddleware } from './WebSocketMiddleware';

export function makeWebSocketServer<T>(
  server: WebSocketServer,
  middleware: WebSocketMiddleware[],
  adapter: WebSocketServerAdapter<T>,
): T {
  return adapter(middleware.reduce((s, m) => m(s), server));
}
