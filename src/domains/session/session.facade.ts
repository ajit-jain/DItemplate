import { SessionEntity } from 'domains/session/entities/session.entity';
import { UpdateSessionRequestDto } from 'domains/session/dtos/update-session.request.dto';
import { ImageEncodingEntity } from 'domains/session/entities/image-encoding.entity';

export interface SessionFacade {
  create(): Promise<SessionEntity>;
  update(
    sessionId: string,
    updateSessionDto: UpdateSessionRequestDto,
  ): Promise<SessionEntity>;
  fetch(): Promise<SessionEntity[]>;
  uploadImageAsync(
    sessionId: string,
    file: Express.Multer.File,
  ): Promise<ImageEncodingEntity>;
  uploadImage(
    sessionId: string,
    file: Express.Multer.File,
  ): Promise<ImageEncodingEntity>;
  upsertFaceEncodings(imageEncodingId: string): Promise<void>;
  fetchSessionSummary(sessionId: string): Promise<SessionEntity>;
}
