import { SessionService } from 'domains/session/services/session.service';
import { Inject, Injectable } from '@nestjs/common';
import { SESSION_REPOSITORY_TOKEN } from 'domains/session/constants/session.contants';
import { SessionRepository } from 'domains/session/repositories/session.repository';
import { SessionEntity } from 'domains/session/entities/session.entity';
import { UpdateSessionRequestDto } from 'domains/session/dtos/update-session.request.dto';
import { SessionNotFound } from 'domains/session/exceptions/session.exceptions';

@Injectable()
export class SessionServiceImpl implements SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY_TOKEN)
    private readonly sessionRepository: SessionRepository,
  ) {}
  async create(session: SessionEntity): Promise<void> {
    await this.sessionRepository.create(session);
  }

  async update(
    sessionId: string,
    updateSessionDto: UpdateSessionRequestDto,
  ): Promise<void> {
    await this.sessionRepository.update(sessionId, updateSessionDto);
  }

  async find(): Promise<SessionEntity[]> {
    return this.sessionRepository.find();
  }

  async findById(id: string): Promise<SessionEntity> {
    const session = await this.sessionRepository.findById(id);
    if (!session) {
      throw new SessionNotFound();
    }
    return session;
  }

  async findByIdWithRelations<K extends keyof SessionEntity>(
    id: string,
    relations: K[],
  ): Promise<SessionEntity> {
    const session = await this.sessionRepository.findByIdWithRelations(
      id,
      relations,
    );
    if (!session) {
      throw new SessionNotFound();
    }
    return session;
  }
}
