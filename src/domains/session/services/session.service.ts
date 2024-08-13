import { SessionEntity } from 'domains/session/entities/session.entity';
import { UpdateSessionRequestDto } from 'domains/session/dtos/update-session.request.dto';

export interface SessionService {
  create(session: SessionEntity): Promise<void>;
  update(
    sessionId: string,
    updateSessionDto: UpdateSessionRequestDto,
  ): Promise<void>;
  find(): Promise<SessionEntity[]>;
  findById(sessionId: string): Promise<SessionEntity>;
  findByIdWithRelations<K extends keyof SessionEntity>(
    id: string,
    relations: K[],
  ): Promise<SessionEntity>;
}
