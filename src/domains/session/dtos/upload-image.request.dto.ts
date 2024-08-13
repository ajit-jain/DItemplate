import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UploadImageRequestDto {
  @ApiProperty({
    description: 'Whether to disable the async flow',
    default: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  @IsOptional()
  @IsBoolean()
  disableAsyncFlow: boolean;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  image: Express.Multer.File;
}
