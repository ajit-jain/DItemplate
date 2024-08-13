import { SessionEntity } from 'domains/session/entities/session.entity';
import { UpdateSessionRequestDto } from 'domains/session/dtos/update-session.request.dto';

export interface SessionRepository {
  create(sessionEntity: SessionEntity): Promise<void>;
  findById(sessionId: string): Promise<SessionEntity | null>;
  update(
    sessionId: string,
    updateSessionDto: UpdateSessionRequestDto,
  ): Promise<void>;
  find(): Promise<SessionEntity[]>;
  findByIdWithRelations<K extends keyof SessionEntity>(
    id: string,
    relations: K[],
  ): Promise<SessionEntity | null>;
}
