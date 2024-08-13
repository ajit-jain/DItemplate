import { InternalServerErrorException } from '@nestjs/common';
import { IMAGE_ENCODING_EXCEPTION_CODES } from 'domains/session/constants/exceptions.constant';

export class ImageEncodingNotFound extends InternalServerErrorException {
  constructor() {
    super({
      name: IMAGE_ENCODING_EXCEPTION_CODES.NOT_FOUND,
      detail: 'Error while fetching image encoding',
    });
  }
}

export class ImageEncodingMaxLimitImagesHasReached extends InternalServerErrorException {
  constructor() {
    super({
      name: IMAGE_ENCODING_EXCEPTION_CODES.MAX_IMAGE_COUNT_IN_SESSION_LIMIT_REACHED,
      detail: 'Error while fetching image encoding',
    });
  }
}
