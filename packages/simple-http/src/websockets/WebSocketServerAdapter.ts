import { WebSocketServer } from './WebSocketServer';

export interface WebSocketServerAdapter<T> {
  (server: WebSocketServer): T;
}
