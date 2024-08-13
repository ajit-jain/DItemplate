import { InternalServerErrorException } from '@nestjs/common';
import { SESSION_EXCEPTION_CODES } from 'domains/session/constants/exceptions.constant';

export class SessionNotFound extends InternalServerErrorException {
  constructor() {
    super({
      name: SESSION_EXCEPTION_CODES.NOT_FOUND,
      detail: 'Error while fetching session',
    });
  }
}
