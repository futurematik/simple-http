import { WebSocketServer } from './WebSocketServer';
import { WebSocketServerAdapter } from './WebSocketServerAdapter';

export function makeWebSocketServer<T>(
  server: WebSocketServer,
  adapter: WebSocketServerAdapter<T>,
): T {
  return adapter(server);
}
