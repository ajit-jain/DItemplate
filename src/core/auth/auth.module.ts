import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from 'core/auth/strategies/api-key.strategy';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'core/auth/auth.config';

@Module({
  imports: [ConfigModule.forFeature(authConfig), PassportModule],
  providers: [ApiKeyStrategy],
  exports: [ApiKeyStrategy],
})
export class AuthModule {}
