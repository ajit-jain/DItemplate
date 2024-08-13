import { Module } from '@nestjs/common';
import { OrmModule } from './orm/orm.module';
import { AuthModule } from './auth/auth.module';
import { MediaStoreModule } from './media-store/media-store.module';
import { LoggerMiddleware } from './logger/logger-middleware.service';

@Module({
  imports: [OrmModule, AuthModule, MediaStoreModule],
  providers: [LoggerMiddleware],
  exports: [OrmModule, AuthModule, MediaStoreModule, LoggerMiddleware],
})
export class CoreModule {}
