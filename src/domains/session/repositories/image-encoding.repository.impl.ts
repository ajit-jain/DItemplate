import { ImageEncodingRepository } from './image-encoding.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateImageEncodingDTO } from 'domains/session/dtos/update-image-encoding.dto';
import { ImageEncodingEntity } from 'domains/session/entities/image-encoding.entity';

export class ImageEncodingRepositoryImpl implements ImageEncodingRepository {
  constructor(
    @InjectRepository(ImageEncodingEntity)
    private readonly baseRepository: Repository<ImageEncodingEntity>,
  ) {}
  async create(imageEncodingEntity: ImageEncodingEntity): Promise<void> {
    await this.baseRepository.save(imageEncodingEntity);
  }
  async findById(id: string): Promise<ImageEncodingEntity | null> {
    return this.baseRepository.findOneBy({ id });
  }
  async find(): Promise<ImageEncodingEntity[]> {
    return this.baseRepository.find();
  }
  async findCountBySessionId(sessionId: string): Promise<number> {
    return this.baseRepository.count({
      where: {
        sessionId,
      },
    });
  }

  async update(
    imageEncodingId: string,
    dto: UpdateImageEncodingDTO,
  ): Promise<void> {
    await this.baseRepository.update({ id: imageEncodingId }, dto);
  }
}
