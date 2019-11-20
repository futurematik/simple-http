/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export interface WebSocketConnection<Msg = any, Ctx = any> {
  id: string;
  ctx: Ctx;
  send(id: string, message: Msg): PromiseLike<void>;
}
