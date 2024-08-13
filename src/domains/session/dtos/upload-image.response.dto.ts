import { ApiProperty } from '@nestjs/swagger';
import { ImageEncodingStatus } from 'domains/session/constants/image-encoding-status.enum';

export class UploadImageResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly status: ImageEncodingStatus;

  @ApiProperty()
  readonly imageUrl: string;

  constructor(id: string, status: ImageEncodingStatus, url: string) {
    this.id = id;
    this.status = status;
    this.imageUrl = url;
  }
}
