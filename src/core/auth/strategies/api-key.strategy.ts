import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  API_KEY_HEADER,
  API_SECURITY_STRATEGY_NAME,
} from 'core/auth/constants/api-headers.constants';
import authConfig from 'core/auth/auth.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  API_SECURITY_STRATEGY_NAME,
) {
  constructor(
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {
    super(
      { header: API_KEY_HEADER, prefix: '' },
      true,
      (apikey: string, done: any) => {
        return this.validateApiKey(apikey, done);
      },
    );
  }
  validateApiKey(apikey: string, done: any): void {
    if (apikey === this.config.apiKey) {
      done(null, true);
    }
    done(new UnauthorizedException(), null);
  }
}
