import { ImageEncodingEntity } from 'domains/session/entities/image-encoding.entity';
import { ImageEncodingEntityFactory } from 'domains/session/factories/image-encoding-entity.factory';
import { ImageEncodingStatus } from 'domains/session/constants/image-encoding-status.enum';

export class ImageEncodingEntityMock {
  static generate(sessionId: string): ImageEncodingEntity {
    return ImageEncodingEntityFactory.createEntity(
      sessionId,
      'test-url',
      ImageEncodingStatus.CREATED,
      'test',
    );
  }
}
