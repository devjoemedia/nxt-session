import { nanoid } from 'nanoid';
import { serialize, parse } from 'cookie';
import sessionStore from './sessionStore';
import { IncomingMessage, ServerResponse } from 'http';

const SESSION_COOKIE_NAME = 'custom_session_id';

export const sessionMiddleware = (handler: (req: IncomingMessage & { session?: Record<string, any>; sessionId?: string }, res: ServerResponse) => void) => {
  return async (req: IncomingMessage & { session?: Record<string, any>; sessionId?: string }, res: ServerResponse) => {
    const cookies = parse(req.headers.cookie || '');
    let sessionId = cookies[SESSION_COOKIE_NAME];

    if (!sessionId || !sessionStore.getSession(sessionId)) {
      sessionId = nanoid();
      sessionStore.createSession(sessionId, {});
      res.setHeader('Set-Cookie', serialize(SESSION_COOKIE_NAME, sessionId, { httpOnly: true, path: '/' }));
    }

    req.session = sessionStore.getSession(sessionId);
    req.sessionId = sessionId;

    return handler(req, res);
  };
};

declare module 'http' {
  interface IncomingMessage {
    session?: Record<string, any>;
    sessionId?: string;
  }
}
