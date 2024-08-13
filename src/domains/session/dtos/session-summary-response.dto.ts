import { ApiProperty } from '@nestjs/swagger';
import { SessionStatus } from 'domains/session/constants/session-status.enum';
import { ImageEncodingStatus } from 'domains/session/constants/image-encoding-status.enum';
import { SessionEntity } from 'domains/session/entities/session.entity';
import { ImageEncodingEntity } from 'domains/session/entities/image-encoding.entity';

export class SessionSummaryResponseDto {
  @ApiProperty()
  readonly id: string;
  @ApiProperty()
  readonly status: SessionStatus;
  @ApiProperty()
  imageEncodings: ImageEncodingResponseDto[];
  constructor(sessionSummary: SessionEntity) {
    this.id = sessionSummary.id;
    this.status = sessionSummary.status;
    this.imageEncodings = (sessionSummary.imageEncodings ?? []).map(
      (imageEncoding) => new ImageEncodingResponseDto(imageEncoding),
    );
  }
}

export class ImageEncodingResponseDto {
  @ApiProperty()
  readonly id: string;
  @ApiProperty()
  readonly status: ImageEncodingStatus;
  @ApiProperty()
  readonly imageUrl: string;
  @ApiProperty()
  encodings: number[][];
  @ApiProperty()
  error: any;
  constructor(imageEncoding: ImageEncodingEntity) {
    this.id = imageEncoding.id;
    this.status = imageEncoding.status;
    this.imageUrl = imageEncoding.imageUrl;
    this.encodings = imageEncoding.encodings;
    this.error = imageEncoding.error;
  }
}
