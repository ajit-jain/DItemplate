import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
const configModule = ConfigModule.forRoot({
  isGlobal: true,
});
import { CoreModule } from 'core/core.module';
import { SessionModule } from 'domains/session/session.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerMiddleware } from 'core/logger/logger-middleware.service';
@Module({
  imports: [
    configModule,
    CoreModule,
    SessionModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
