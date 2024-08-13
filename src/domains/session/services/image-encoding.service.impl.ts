import { ImageEncodingEntity } from 'domains/session/entities/image-encoding.entity';
import { ImageEncodingService } from 'domains/session/services/image-encoding.service';
import { Inject } from '@nestjs/common';
import { IMAGE_ENCODING_REPOSITORY_TOKEN } from 'domains/session/constants/image-encoding.contants';
import { ImageEncodingRepository } from 'domains/session/repositories/image-encoding.repository';
import {
  ImageEncodingMaxLimitImagesHasReached,
  ImageEncodingNotFound,
} from 'domains/session/exceptions/image-encoding.exceptions';
import { MAX_IMAGE_COUNT_IN_SESSION } from 'domains/session/constants/exceptions.constant';
import { UpdateImageEncodingDTO } from 'domains/session/dtos/update-image-encoding.dto';
import axios from 'axios';
import * as FormData from 'form-data';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

export class ImageEncodingServiceImpl implements ImageEncodingService {
  constructor(
    @Inject(IMAGE_ENCODING_REPOSITORY_TOKEN)
    private readonly imageEncodingRepository: ImageEncodingRepository,
    private readonly httpService: HttpService,
  ) { }

  create(imageEncoding: ImageEncodingEntity): Promise<void> {
    return this.imageEncodingRepository.create(imageEncoding);
  }

  async findById(id: string): Promise<ImageEncodingEntity> {
    const imageEncoding = await this.imageEncodingRepository.findById(id);
    if (!imageEncoding) {
      throw new ImageEncodingNotFound();
    }
    return imageEncoding;
  }

  async checkEncodingCountBySessionId(sessionId: string): Promise<number> {
    const existingImageCountInSession =
      await this.imageEncodingRepository.findCountBySessionId(sessionId);
    if (existingImageCountInSession >= MAX_IMAGE_COUNT_IN_SESSION) {
      throw new ImageEncodingMaxLimitImagesHasReached();
    }
    return existingImageCountInSession;
  }

  async update(
    imageEncodingId: string,
    dto: UpdateImageEncodingDTO,
  ): Promise<void> {
    await this.imageEncodingRepository.update(imageEncodingId, dto);
  }

  async fetchFaceEncodings(imageEncodingId: string): Promise<number[][]> {
    const imageEncoding = await this.findById(imageEncodingId);

    const response = await axios.get(imageEncoding.imageUrl, {
      responseType: 'stream',
    });

    const form = new FormData();
    form.append('file', response.data, {
      filename: imageEncoding.imageName,
    } as any);

    const headers = form.getHeaders();

    const uploadResponse = this.httpService.request({
      method: 'POST',
      baseURL: process.env.EXTERNAL_FACE_ENCODING_SERVICE_URL!,
      url: '/v1/selfie',
      data: form,
      headers,
    });

    return (await lastValueFrom(uploadResponse)).data;
  }
}
