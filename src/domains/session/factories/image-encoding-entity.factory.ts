import { randomUUID } from 'crypto';
import { ImageEncodingStatus } from 'domains/session/constants/image-encoding-status.enum';
import { ImageEncodingEntity } from 'domains/session/entities/image-encoding.entity';

export class ImageEncodingEntityFactory {
  static createEntity(
    sessionId: string,
    imageUrl: string,
    status: ImageEncodingStatus,
    imageName: string,
  ) {
    const imageEncoding = new ImageEncodingEntity();
    imageEncoding.id = randomUUID();
    imageEncoding.status = status;
    imageEncoding.imageUrl = imageUrl;
    imageEncoding.sessionId = sessionId;
    imageEncoding.imageName = imageName;
    return imageEncoding;
  }
}
