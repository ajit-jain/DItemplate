import { SessionEntity } from 'domains/session/entities/session.entity';
import { SessionEntityFactory } from 'domains/session/factories/session-entity.factory';
import { SessionStatus } from 'domains/session/constants/session-status.enum';
import { ImageEncodingEntityMock } from './image-encoding.entity.mock';

export class SessionEntityMock {
  static generate(): SessionEntity {
    return SessionEntityFactory.createEntity(SessionStatus.CREATED);
  }
  static generateWithImageEncodings(): SessionEntity {
    const session = SessionEntityFactory.createEntity(SessionStatus.CREATED);
    session.imageEncodings = [ImageEncodingEntityMock.generate(session.id)];
    return session;
  }
}
