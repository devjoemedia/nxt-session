class SessionStore {
  private sessions: Map<string, Record<string, any>>;

  constructor() {
    this.sessions = new Map();
  }

  createSession(sessionId: string, data: Record<string, any>) {
    this.sessions.set(sessionId, data);
  }

  getSession(sessionId: string): Record<string, any> | undefined {
    return this.sessions.get(sessionId);
  }

  deleteSession(sessionId: string) {
    this.sessions.delete(sessionId);
  }
}

const sessionStore = new SessionStore();
export default sessionStore;
