import { FetchImageEncodingsType } from 'domains/session/types/fetch-image-encodings.type';

export class FetchFaceEncodingEvent implements FetchImageEncodingsType {
  imageEncodingId: string;
  constructor(imageEncodingId: string) {
    this.imageEncodingId = imageEncodingId;
  }
}
