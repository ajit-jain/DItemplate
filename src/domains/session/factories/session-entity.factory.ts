import { SessionEntity } from 'domains/session/entities/session.entity';
import { randomUUID } from 'crypto';
import { SessionStatus } from 'domains/session/constants/session-status.enum';
export class SessionEntityFactory {
  static createEntity(status: SessionStatus) {
    const session = new SessionEntity();
    session.id = randomUUID();
    session.status = status;
    return session;
  }
}
