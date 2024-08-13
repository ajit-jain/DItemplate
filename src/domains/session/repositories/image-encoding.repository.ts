import { ImageEncodingEntity } from 'domains/session/entities/image-encoding.entity';
import { UpdateImageEncodingDTO } from 'domains/session/dtos/update-image-encoding.dto';

export interface ImageEncodingRepository {
  create(sessionEntity: ImageEncodingEntity): Promise<void>;
  findById(id: string): Promise<ImageEncodingEntity | null>;
  find(): Promise<ImageEncodingEntity[]>;
  findCountBySessionId(sessionId: string): Promise<number>;
  update(imageEncodingId: string, dto: UpdateImageEncodingDTO): Promise<void>;
}
