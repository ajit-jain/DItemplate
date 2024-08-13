import { ApiProperty } from '@nestjs/swagger';
import { SessionStatus } from 'domains/session/constants/session-status.enum';

export class SessionResponseDto {
  @ApiProperty()
  readonly id: string;
  @ApiProperty()
  readonly status: SessionStatus;

  constructor(id: string, status: SessionStatus) {
    this.id = id;
    this.status = status;
  }
}
