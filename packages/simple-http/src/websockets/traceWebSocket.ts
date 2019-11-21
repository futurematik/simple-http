import { LogFn } from '../common/LogInterop';
import { WebSocketMiddleware } from './WebSocketMiddleware';
import { WebSocketServer } from './WebSocketServer';
import { WebSocketConnection } from './WebSocketConnection';

export interface TraceWebSocketOptions {
  trace?: LogFn;
  traceData?: object;
}

export function traceWebSocket({
  trace,
  traceData,
}: TraceWebSocketOptions): WebSocketMiddleware {
  const tracer = traceAction(trace, traceData);

  return (ws): WebSocketServer => {
    const ret: WebSocketServer = {};
    const { connect, disconnect, message } = ws;

    if (connect) {
      ret.connect = async conn => {
        tracer(conn, 'connect');
        return connect(traceSend(conn, tracer));
      };
    }
    if (disconnect) {
      ret.disconnect = async conn => {
        tracer(conn, 'disconnect');
        return disconnect(traceSend(conn, tracer));
      };
    }
    if (message) {
      ret.message = async (conn, msg) => {
        tracer(conn, 'message', msg);
        return message(traceSend(conn, tracer), msg);
      };
    }

    return ret;
  };
}

type Tracer = (
  conn: WebSocketConnection,
  action: string,
  message?: object,
  other?: object,
) => void;

function traceAction(trace?: LogFn, traceData?: object): Tracer {
  if (trace) {
    return (conn, action, message, other) =>
      trace({
        msg: action,
        ...traceData,
        id: conn.id,
        ctx: conn.ctx,
        message,
        ...other,
      });
  }
  return () => {};
}

function traceSend(
  conn: WebSocketConnection,
  trace: Tracer,
): WebSocketConnection {
  return {
    ...conn,

    async send(id: string, message: any): Promise<void> {
      trace(conn, 'send', message, { to: id });
      await conn.send(id, message);
    },
  };
}
