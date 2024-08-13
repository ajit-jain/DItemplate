import { SessionFacadeImpl } from 'domains/session/session.facade.impl';
import { SessionServiceMock } from '../../../test/mocks/services/session.service.mock';
import { SessionService } from 'domains/session/services/session.service';
import { ImageStoreFacade } from 'core/media-store/image-store.facade';
import { S3ServiceMock } from '../../../test/mocks/services/s3.service.mock';
import { ImageEncodingService } from 'domains/session/services/image-encoding.service';
import { ImageEncodingServiceMock } from '../../../test/mocks/services/image-encoding.service.mock';
import { MockEventEmitter2 } from '../../../test/mocks/event-emitter.mock';
import { SessionEntityMock } from '../../../test/mocks/entities/session.entity.mock';
import { SessionNotFound } from 'domains/session/exceptions/session.exceptions';
import { SessionEntity } from 'domains/session/entities/session.entity';
import { SessionStatus } from 'domains/session/constants/session-status.enum';
import { ImageEncodingEntity } from 'domains/session/entities/image-encoding.entity';
import { ImageEncodingEntityMock } from '../../../test/mocks/entities/image-encoding.entity.mock';
import {
  ImageEncodingMaxLimitImagesHasReached,
  ImageEncodingNotFound,
} from 'domains/session/exceptions/image-encoding.exceptions';

describe('SessionFacade', () => {
  let sessionFacade: SessionFacadeImpl;

  let sessionService: jest.Mocked<SessionService>;
  let imageStoreService: jest.Mocked<ImageStoreFacade>;
  let imageEncodingService: jest.Mocked<ImageEncodingService>;
  let eventEmitterMock: MockEventEmitter2;
  beforeEach(() => {
    sessionService = SessionServiceMock();
    imageStoreService = S3ServiceMock();
    imageEncodingService = ImageEncodingServiceMock();
    eventEmitterMock = new MockEventEmitter2();
    sessionFacade = new SessionFacadeImpl(
      sessionService,
      imageStoreService,
      imageEncodingService,
      eventEmitterMock,
    );
  });
  describe('create', () => {
    const session = SessionEntityMock.generate();
    it('return session entity', async () => {
      sessionService.create.mockResolvedValue(undefined);
      sessionService.findById.mockResolvedValue(session);
      const sessionEntity = await sessionFacade.create();
      expect(sessionEntity).toStrictEqual(session);
    });

    it('return error when findBy return not found session', async () => {
      sessionService.create.mockResolvedValue(undefined);
      sessionService.findById.mockRejectedValue(new SessionNotFound());
      await expect(sessionFacade.create()).rejects.toThrow(
        new SessionNotFound(),
      );
    });
  });

  describe('update', () => {
    let session: SessionEntity;
    beforeEach(() => {
      session = SessionEntityMock.generate();
    });
    it('return session entity', async () => {
      session.status = SessionStatus.COMPLETED;
      sessionService.update.mockResolvedValue(undefined);
      sessionService.findById.mockResolvedValue(session);
      const sessionEntity = await sessionFacade.update(session.id, {
        status: SessionStatus.COMPLETED,
      });
      expect(sessionEntity).toStrictEqual(session);
    });

    it('return error when findById return not found session', async () => {
      sessionService.update.mockResolvedValue(undefined);
      sessionService.findById.mockRejectedValue(new SessionNotFound());
      await expect(sessionFacade.create()).rejects.toThrow(
        new SessionNotFound(),
      );
    });
  });

  describe('uploadImageAsync', () => {
    let session: SessionEntity;
    let imageEncoding: ImageEncodingEntity;
    beforeEach(() => {
      session = SessionEntityMock.generate();
      imageEncoding = ImageEncodingEntityMock.generate(session.id);
    });
    it('return image encoding entity', async () => {
      imageEncodingService.checkEncodingCountBySessionId.mockResolvedValue(1);
      imageStoreService.uploadImage.mockResolvedValue('test-url');
      imageEncodingService.create.mockResolvedValue(undefined);
      imageEncodingService.findById.mockResolvedValue(imageEncoding);
      eventEmitterMock.emit.mockReturnValue(true);
      const imageEncodingEntity = await sessionFacade.uploadImageAsync(
        session.id,
        {
          originalname: 'test-image',
        } as Express.Multer.File,
      );
      expect(imageEncodingEntity).toStrictEqual(imageEncoding);
    });

    it('return error when checkEncodingCountBySessionId throws max image count exception', async () => {
      imageEncodingService.checkEncodingCountBySessionId.mockRejectedValue(
        new ImageEncodingMaxLimitImagesHasReached(),
      );
      await expect(
        sessionFacade.uploadImageAsync(session.id, {
          originalname: 'test-image',
        } as Express.Multer.File),
      ).rejects.toThrow(new ImageEncodingMaxLimitImagesHasReached());
    });

    it('return error when imageStore throws an exception', async () => {
      const error = new Error('Image store error');
      imageEncodingService.checkEncodingCountBySessionId.mockResolvedValue(1);
      imageStoreService.uploadImage.mockRejectedValue(error);
      await expect(
        sessionFacade.uploadImageAsync(session.id, {
          originalname: 'test-image',
        } as Express.Multer.File),
      ).rejects.toThrow(error);
    });

    it('return error when findById throws not found exception', async () => {
      imageEncodingService.checkEncodingCountBySessionId.mockResolvedValue(1);
      imageStoreService.uploadImage.mockResolvedValue('test-url');
      imageEncodingService.create.mockResolvedValue(undefined);
      imageEncodingService.findById.mockRejectedValue(
        new ImageEncodingNotFound(),
      );
      await expect(
        sessionFacade.uploadImageAsync(session.id, {
          originalname: 'test-image',
        } as Express.Multer.File),
      ).rejects.toThrow(new ImageEncodingNotFound());
    });
  });

  describe('uploadImage', () => {
    let session: SessionEntity;
    let imageEncoding: ImageEncodingEntity;
    beforeEach(() => {
      session = SessionEntityMock.generate();
      imageEncoding = ImageEncodingEntityMock.generate(session.id);
    });
    it('return image encoding entity', async () => {
      imageEncodingService.checkEncodingCountBySessionId.mockResolvedValue(1);
      imageStoreService.uploadImage.mockResolvedValue('test-url');
      imageEncodingService.create.mockResolvedValue(undefined);
      imageEncodingService.findById.mockResolvedValue(imageEncoding);
      jest
        .spyOn(sessionFacade, 'upsertFaceEncodings')
        .mockResolvedValueOnce(undefined);
      const imageEncodingEntity = await sessionFacade.uploadImage(session.id, {
        originalname: 'test-image',
      } as Express.Multer.File);
      expect(imageEncodingEntity).toStrictEqual(imageEncoding);
    });

    it('return error when checkEncodingCountBySessionId throws max image count exception', async () => {
      imageEncodingService.checkEncodingCountBySessionId.mockRejectedValue(
        new ImageEncodingMaxLimitImagesHasReached(),
      );
      await expect(
        sessionFacade.uploadImage(session.id, {
          originalname: 'test-image',
        } as Express.Multer.File),
      ).rejects.toThrow(new ImageEncodingMaxLimitImagesHasReached());
    });

    it('return error when imageStore throws an exception', async () => {
      const error = new Error('Image store error');
      imageEncodingService.checkEncodingCountBySessionId.mockResolvedValue(1);
      imageStoreService.uploadImage.mockRejectedValue(error);
      await expect(
        sessionFacade.uploadImage(session.id, {
          originalname: 'test-image',
        } as Express.Multer.File),
      ).rejects.toThrow(error);
    });

    it('return error when findById throws not found exception', async () => {
      imageEncodingService.checkEncodingCountBySessionId.mockResolvedValue(1);
      imageStoreService.uploadImage.mockResolvedValue('test-url');
      imageEncodingService.create.mockResolvedValue(undefined);
      imageEncodingService.findById.mockRejectedValue(
        new ImageEncodingNotFound(),
      );
      await expect(
        sessionFacade.uploadImage(session.id, {
          originalname: 'test-image',
        } as Express.Multer.File),
      ).rejects.toThrow(new ImageEncodingNotFound());
    });
    it('return error when upsertImageEncodings throws an exception', async () => {
      const error = new Error('upsertImageEncodings error');
      imageEncodingService.checkEncodingCountBySessionId.mockResolvedValue(1);
      imageStoreService.uploadImage.mockResolvedValue('test-url');
      imageEncodingService.create.mockResolvedValue(undefined);
      imageEncodingService.findById.mockResolvedValue(imageEncoding);
      jest.spyOn(sessionFacade, 'upsertFaceEncodings').mockRejectedValue(error);
      await expect(
        sessionFacade.uploadImage(session.id, {
          originalname: 'test-image',
        } as Express.Multer.File),
      ).rejects.toThrow(error);
    });
  });

  describe('upsertFaceEncodings', () => {
    let session: SessionEntity;
    let imageEncoding: ImageEncodingEntity;
    beforeEach(() => {
      session = SessionEntityMock.generate();
      imageEncoding = ImageEncodingEntityMock.generate(session.id);
    });

    it('return void with any errors', async () => {
      imageEncodingService.update.mockResolvedValue(undefined);
      imageEncodingService.fetchFaceEncodings.mockResolvedValue([[]]);
      imageEncodingService.update.mockResolvedValue(undefined);
      const result = await sessionFacade.upsertFaceEncodings(imageEncoding.id);
      expect(result).toBeUndefined();
    });
  });
});
