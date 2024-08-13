import { Module } from '@nestjs/common';
import { S3Service } from './s3/s3.service';
import { IMAGE_STORE_SERVICE_TOKEN } from 'core/media-store/constants/media-store.constants';

@Module({
  providers: [
    {
      provide: IMAGE_STORE_SERVICE_TOKEN,
      useClass: S3Service,
    },
  ],
  exports: [IMAGE_STORE_SERVICE_TOKEN],
})
export class MediaStoreModule {}
