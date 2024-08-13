import { SessionEntity } from 'domains/session/entities/session.entity';
import { UpdateSessionRequestDto } from 'domains/session/dtos/update-session.request.dto';
import { SessionFacade } from 'domains/session/session.facade';
import { SessionEntityFactory } from 'domains/session/factories/session-entity.factory';
import { SessionStatus } from 'domains/session/constants/session-status.enum';
import { Inject } from '@nestjs/common';
import { SESSION_SERVICE_TOKEN } from 'domains/session/constants/session.contants';
import { SessionService } from 'domains/session/services/session.service';
import { IMAGE_STORE_SERVICE_TOKEN } from 'core/media-store/constants/media-store.constants';
import { ImageStoreFacade } from 'core/media-store/image-store.facade';
import { ImageEncodingEntityFactory } from 'domains/session/factories/image-encoding-entity.factory';
import { ImageEncodingStatus } from 'domains/session/constants/image-encoding-status.enum';
import { ImageEncodingService } from 'domains/session/services/image-encoding.service';
import { ImageEncodingEntity } from 'domains/session/entities/image-encoding.entity';
import { IMAGE_ENCODING_SERVICE_TOKEN } from 'domains/session/constants/image-encoding.contants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FetchFaceEncodingEvent } from 'domains/session/event-emitters/fetch-face-encoding.event';
import { randomUUID } from 'crypto';

export class SessionFacadeImpl implements SessionFacade {
  constructor(
    @Inject(SESSION_SERVICE_TOKEN)
    private readonly sessionService: SessionService,
    @Inject(IMAGE_STORE_SERVICE_TOKEN)
    private readonly imageStore: ImageStoreFacade,
    @Inject(IMAGE_ENCODING_SERVICE_TOKEN)
    private readonly imageEncodingService: ImageEncodingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async create(): Promise<SessionEntity> {
    const sessionEntity: SessionEntity = SessionEntityFactory.createEntity(
      SessionStatus.CREATED,
    );
    await this.sessionService.create(sessionEntity);
    return await this.sessionService.findById(sessionEntity.id);
  }
  async update(
    sessionId: string,
    updateSessionDto: UpdateSessionRequestDto,
  ): Promise<SessionEntity> {
    await this.sessionService.update(sessionId, updateSessionDto);
    return await this.sessionService.findById(sessionId);
  }
  fetch(): Promise<SessionEntity[]> {
    return this.sessionService.find();
  }

  async uploadImageAsync(
    sessionId: string,
    imageFile: Express.Multer.File,
  ): Promise<ImageEncodingEntity> {
    await this.imageEncodingService.checkEncodingCountBySessionId(sessionId);

    const imageName = `${randomUUID()}-${imageFile.originalname}`;
    const imageUrl = await this.imageStore.uploadImage(imageName, imageFile);

    const imageEncodingEntity = ImageEncodingEntityFactory.createEntity(
      sessionId,
      imageUrl,
      ImageEncodingStatus.CREATED,
      imageName,
    );

    await this.imageEncodingService.create(imageEncodingEntity);

    this.eventEmitter.emit(
      FetchFaceEncodingEvent.name,
      new FetchFaceEncodingEvent(imageEncodingEntity.id),
    );

    return await this.imageEncodingService.findById(imageEncodingEntity.id);
  }

  async uploadImage(
    sessionId: string,
    imageFile: Express.Multer.File,
  ): Promise<ImageEncodingEntity> {
    await this.imageEncodingService.checkEncodingCountBySessionId(sessionId);

    const imageName = `${randomUUID()}-${imageFile.originalname}`;
    const imageUrl = await this.imageStore.uploadImage(imageName, imageFile);

    const imageEncodingEntity = ImageEncodingEntityFactory.createEntity(
      sessionId,
      imageUrl,
      ImageEncodingStatus.CREATED,
      imageName,
    );

    await this.imageEncodingService.create(imageEncodingEntity);
    await this.upsertFaceEncodings(imageEncodingEntity.id);
    return await this.imageEncodingService.findById(imageEncodingEntity.id);
  }

  async upsertFaceEncodings(imageEncodingId: string): Promise<void> {
    try {
      await this.imageEncodingService.update(imageEncodingId, {
        encodings: [[]],
        status: ImageEncodingStatus.INITIATED,
      });
      const encodings =
        await this.imageEncodingService.fetchFaceEncodings(imageEncodingId);
      await this.imageEncodingService.update(imageEncodingId, {
        encodings,
        status: ImageEncodingStatus.COMPLETED,
      });
    } catch (e: any) {
      await this.imageEncodingService.update(imageEncodingId, {
        encodings: [[]],
        status: ImageEncodingStatus.FAILED,
        error: e.response.data,
      });
    }
  }

  async fetchSessionSummary(sessionId: string): Promise<SessionEntity> {
    return this.sessionService.findByIdWithRelations(sessionId, [
      'imageEncodings',
    ]);
  }
}
