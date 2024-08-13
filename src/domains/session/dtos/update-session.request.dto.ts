import { ApiProperty } from '@nestjs/swagger';
import { SessionStatus } from 'domains/session/constants/session-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateSessionRequestDto {
  @ApiProperty({
    enum: SessionStatus,
  })
  @IsNotEmpty()
  @IsEnum(SessionStatus)
  readonly status: SessionStatus;
}
