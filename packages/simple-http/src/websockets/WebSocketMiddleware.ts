import { WebSocketServer } from './WebSocketServer';

export interface WebSocketMiddleware {
  (ws: WebSocketServer): WebSocketServer;
}
