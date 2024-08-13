import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { ImageEncodingEntity } from './entities/image-encoding.entity';
import {
  SESSION_FACADE_TOKEN,
  SESSION_REPOSITORY_TOKEN,
  SESSION_SERVICE_TOKEN,
} from './constants/session.contants';
import { SessionRepositoryImpl } from './repositories/session.repository.impl';
import {
  IMAGE_ENCODING_REPOSITORY_TOKEN,
  IMAGE_ENCODING_SERVICE_TOKEN,
} from './constants/image-encoding.contants';
import { ImageEncodingRepositoryImpl } from './repositories/image-encoding.repository.impl';
import { SessionController } from 'domains/session/controllers/session.controller';
import { SessionServiceImpl } from 'domains/session/services/session.service.impl';
import { SessionFacadeImpl } from 'domains/session/session.facade.impl';
import { MediaStoreModule } from 'core/media-store/media-store.module';
import { ImageEncodingServiceImpl } from 'domains/session/services/image-encoding.service.impl';
import { FetchFaceEncodingEventListener } from 'domains/session/event-emitters/fetch-face-encoding.event-listener';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity, ImageEncodingEntity]),
    MediaStoreModule,
    HttpModule,
  ],
  providers: [
    {
      provide: SESSION_REPOSITORY_TOKEN,
      useClass: SessionRepositoryImpl,
    },
    {
      provide: IMAGE_ENCODING_REPOSITORY_TOKEN,
      useClass: ImageEncodingRepositoryImpl,
    },
    {
      provide: SESSION_SERVICE_TOKEN,
      useClass: SessionServiceImpl,
    },
    {
      provide: SESSION_FACADE_TOKEN,
      useClass: SessionFacadeImpl,
    },
    {
      provide: IMAGE_ENCODING_SERVICE_TOKEN,
      useClass: ImageEncodingServiceImpl,
    },
    FetchFaceEncodingEventListener,
  ],
  controllers: [SessionController],
})
export class SessionModule {}
