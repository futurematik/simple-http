import { WebSocketConnection } from './WebSocketConnection';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export interface WebSocketServer<Msg = any, Ctx = any> {
  connect?(conn: WebSocketConnection<Msg, Ctx>): PromiseLike<void>;
  disconnect?(conn: WebSocketConnection<Msg, Ctx>): PromiseLike<void>;
  message?(
    conn: WebSocketConnection<Msg, Ctx>,
    message: Msg,
  ): PromiseLike<void>;
}
