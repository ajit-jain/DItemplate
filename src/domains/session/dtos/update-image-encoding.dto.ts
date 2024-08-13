import { ImageEncodingStatus } from 'domains/session/constants/image-encoding-status.enum';

export interface UpdateImageEncodingDTO {
  encodings?: number[][];
  status?: ImageEncodingStatus;
  error?: string;
}
