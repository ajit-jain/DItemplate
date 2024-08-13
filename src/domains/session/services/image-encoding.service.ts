import { ImageEncodingEntity } from 'domains/session/entities/image-encoding.entity';
import { UpdateImageEncodingDTO } from 'domains/session/dtos/update-image-encoding.dto';

export interface ImageEncodingService {
  create(imageEncoding: ImageEncodingEntity): Promise<void>;
  findById(id: string): Promise<ImageEncodingEntity>;
  checkEncodingCountBySessionId(sessionId: string): Promise<number>;
  update(imageEncodingId: string, dto: UpdateImageEncodingDTO): Promise<void>;
  fetchFaceEncodings(imageEncodingId: string): Promise<number[][]>;
}
