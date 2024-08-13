import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from 'domains/session/controllers/session.controller';
import { SESSION_FACADE_TOKEN } from 'domains/session/constants/session.contants';
import { SessionFacadeMock } from '../../../../test/mocks/facades/session.facade.mock';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ApiKeyStrategy } from 'core/auth/strategies/api-key.strategy';
import * as request from 'supertest';
import { SessionFacade } from 'domains/session/session.facade';
import { SessionEntityMock } from '../../../../test/mocks/entities/session.entity.mock';
import { SessionResponseDto } from 'domains/session/dtos/session.response.dto';
import { SessionSummaryResponseDto } from 'domains/session/dtos/session-summary-response.dto';
import { CreateSessionResponseDto } from 'domains/session/dtos/create-session.response.dto';
import { SessionStatus } from 'domains/session/constants/session-status.enum';
import { UpdateSessionResponseDto } from 'domains/session/dtos/update-session.response.dto';
import { SessionEntity } from 'domains/session/entities/session.entity';
import { ImageEncodingEntity } from 'domains/session/entities/image-encoding.entity';
import { ImageEncodingEntityMock } from '../../../../test/mocks/entities/image-encoding.entity.mock';
import { UploadImageResponseDto } from 'domains/session/dtos/upload-image.response.dto';

describe('SessionController', () => {
  let controller: SessionController;
  let app: INestApplication;
  let apiKeyStrategy: ApiKeyStrategy;
  let sessionFacade: jest.Mocked<SessionFacade>;
  const apiKey = '7b34f1fe-6fec-46ea-95be-365dd0cb9164';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SESSION_FACADE_TOKEN,
          useValue: SessionFacadeMock(),
        },
        {
          provide: ApiKeyStrategy,
          useValue: new ApiKeyStrategy({ apiKey }),
        },
      ],
      controllers: [SessionController],
    }).compile();

    controller = module.get<SessionController>(SessionController);
    apiKeyStrategy = module.get<ApiKeyStrategy>(ApiKeyStrategy);
    sessionFacade =
      module.get<jest.Mocked<SessionFacade>>(SESSION_FACADE_TOKEN);
    app = module.createNestApplication();
    await app.init();
  });

  it('dependencies should be defined', () => {
    expect(controller).toBeDefined();
    expect(apiKeyStrategy).toBeDefined();
    expect(sessionFacade).toBeDefined();
  });

  describe('/GET sessions', () => {
    it('should throw 401 when unauthorized', () => {
      return request(app.getHttpServer())
        .get('/sessions')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should 200 when request is authorised', () => {
      sessionFacade.fetch.mockResolvedValue([]);
      return request(app.getHttpServer())
        .get('/sessions')
        .set('X-API-KEY', apiKey)
        .expect(HttpStatus.OK);
    });
    it('should return sessions', () => {
      const sessions = [SessionEntityMock.generate()];
      sessionFacade.fetch.mockResolvedValue(sessions);
      return request(app.getHttpServer())
        .get('/sessions')
        .set('X-API-KEY', apiKey)
        .expect((res: Response) => {
          expect(res.status).toEqual(HttpStatus.OK);
          expect(res.body).toEqual(
            sessions.map(
              (session) => new SessionResponseDto(session.id, session.status),
            ),
          );
        });
    });
  });

  describe('/GET session summary', () => {
    const session = SessionEntityMock.generateWithImageEncodings();
    it('should throw 401 when unauthorized', () => {
      return request(app.getHttpServer())
        .get(`/sessions/${session.id}/summary`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should 400 when request is authorised and but sessionId format is wrong', () => {
      sessionFacade.fetch.mockResolvedValue([]);
      return request(app.getHttpServer())
        .get('/sessions/test/summary')
        .set('X-API-KEY', apiKey)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return session summary', () => {
      sessionFacade.fetchSessionSummary.mockResolvedValue(session);
      return request(app.getHttpServer())
        .get(`/sessions/${session.id}/summary`)
        .set('X-API-KEY', apiKey)
        .expect((res: Response) => {
          expect(res.status).toEqual(HttpStatus.OK);
          expect(res.body).toEqual(new SessionSummaryResponseDto(session));
        });
    });
  });

  describe('/POST session', () => {
    it('should throw 401 when unauthorized', () => {
      return request(app.getHttpServer())
        .post(`/sessions`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return new session', () => {
      const session = SessionEntityMock.generate();
      sessionFacade.create.mockResolvedValue(session);
      return request(app.getHttpServer())
        .post('/sessions')
        .set('X-API-KEY', apiKey)
        .expect((res: Response) => {
          expect(res.status).toEqual(HttpStatus.CREATED);
          expect(res.body).toEqual(
            new CreateSessionResponseDto(session.id, session.status),
          );
        });
    });
  });

  describe('/PATCH session', () => {
    let session: SessionEntity;
    beforeEach(() => {
      session = SessionEntityMock.generate();
    });

    it('should throw 401 when unauthorized', () => {
      return request(app.getHttpServer())
        .patch(`/sessions/${session.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return updated session', () => {
      session.status = SessionStatus.COMPLETED;
      sessionFacade.update.mockResolvedValue(session);
      return request(app.getHttpServer())
        .patch(`/sessions/${session.id}`)
        .set('X-API-KEY', apiKey)
        .send({
          status: SessionStatus.COMPLETED,
        })
        .expect((res: Response) => {
          expect(res.status).toEqual(HttpStatus.OK);
          expect(res.body).toEqual(
            new UpdateSessionResponseDto(session.id, session.status),
          );
        });
    });

    it('should return 400 when session status is wrong', () => {
      session.status = SessionStatus.COMPLETED;
      sessionFacade.update.mockResolvedValue(session);
      return request(app.getHttpServer())
        .patch(`/sessions/${session.id}`)
        .set('X-API-KEY', apiKey)
        .send({
          status: 'test',
        })
        .expect((res: Response) => {
          expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
        });
    });
  });

  describe('/Post uploadImage session', () => {
    const fileOptions = { filename: 'file.jpg', contentType: 'image/jpeg' };
    const fileBuffer = Buffer.from('fake file content');
    let session: SessionEntity;
    let imageEncoding: ImageEncodingEntity;
    beforeEach(() => {
      session = SessionEntityMock.generate();
      imageEncoding = ImageEncodingEntityMock.generate(session.id);
    });

    it('should throw 401 when unauthorized', () => {
      return request(app.getHttpServer())
        .post(`/sessions/${session.id}/images`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return imageEncoding when file is async', () => {
      sessionFacade.uploadImageAsync.mockResolvedValue(imageEncoding);
      return request(app.getHttpServer())
        .post(`/sessions/${session.id}/images`)
        .set('X-API-KEY', apiKey)
        .field('disableAsyncFlow', 'false')
        .attach('image', fileBuffer, fileOptions)
        .expect((res: Response) => {
          expect(res.status).toEqual(HttpStatus.CREATED);
          expect(res.body).toEqual(
            new UploadImageResponseDto(
              imageEncoding.id,
              imageEncoding.status,
              imageEncoding.imageUrl,
            ),
          );
        });
    });
    it('should return imageEncoding when file is sync', () => {
      sessionFacade.uploadImage.mockResolvedValue(imageEncoding);
      return request(app.getHttpServer())
        .post(`/sessions/${session.id}/images`)
        .set('X-API-KEY', apiKey)
        .field('disableAsyncFlow', 'true')
        .attach('image', fileBuffer, fileOptions)
        .expect((res: Response) => {
          expect(res.status).toEqual(HttpStatus.CREATED);
          expect(res.body).toEqual(
            new UploadImageResponseDto(
              imageEncoding.id,
              imageEncoding.status,
              imageEncoding.imageUrl,
            ),
          );
        });
    });

    it('should return 422 when file is not image', () => {
      sessionFacade.uploadImage.mockResolvedValue(imageEncoding);
      return request(app.getHttpServer())
        .post(`/sessions/${session.id}/images`)
        .set('X-API-KEY', apiKey)
        .field('disableAsyncFlow', 'true')
        .attach('image', fileBuffer, {
          ...fileOptions,
          contentType: 'file/csv',
        })
        .expect((res: Response) => {
          expect(res.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
        });
    });

    it('should return 422 when file is larger in size image', () => {
      const largeString = 'a'.repeat(2.1 * 1024 * 1024); // 2 MB
      const largeBufferFile = Buffer.from(largeString);
      sessionFacade.uploadImage.mockResolvedValue(imageEncoding);
      return request(app.getHttpServer())
        .post(`/sessions/${session.id}/images`)
        .set('X-API-KEY', apiKey)
        .field('disableAsyncFlow', 'true')
        .attach('image', largeBufferFile, fileOptions)
        .expect((res: Response) => {
          expect(res.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
        });
    });
  });
});
