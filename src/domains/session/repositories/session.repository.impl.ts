import { SessionRepository } from './session.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateSessionRequestDto } from 'domains/session/dtos/update-session.request.dto';
import { SessionEntity } from 'domains/session/entities/session.entity';

export class SessionRepositoryImpl implements SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly baseRepository: Repository<SessionEntity>,
  ) {}
  async create(sessionEntity: SessionEntity): Promise<void> {
    await this.baseRepository.save(sessionEntity);
  }
  async findById(sessionId: string): Promise<SessionEntity | null> {
    return this.baseRepository.findOneBy({ id: sessionId });
  }
  async update(
    sessionId: string,
    updateSessionDto: UpdateSessionRequestDto,
  ): Promise<void> {
    await this.baseRepository.update({ id: sessionId }, updateSessionDto);
  }
  find(): Promise<SessionEntity[]> {
    return this.baseRepository.find();
  }
  async findByIdWithRelations<K extends keyof SessionEntity>(
    id: string,
    relations: K[],
  ): Promise<SessionEntity | null> {
    return await this.baseRepository.findOne({
      where: { id },
      relations,
    });
  }
}
